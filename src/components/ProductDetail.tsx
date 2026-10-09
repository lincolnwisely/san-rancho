"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type {
  PrintifyImage,
  PrintifyOption,
  PrintifyProduct,
} from "@/types/printify";
import { useCart } from "@/lib/cart-context";
import { getVariantImages } from "@/lib/printify";
import { formatPrice, sanitizeDescription } from "@/lib/format";

function ProductGallery({
  images,
  alt,
}: {
  images: PrintifyImage[];
  alt: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const mainImage = images[activeIndex] ?? images[0];

  return (
    <div>
      <div className="aspect-square w-full overflow-hidden bg-surface">
        {mainImage ? (
          <Image
            src={mainImage.src}
            alt={alt}
            width={1000}
            height={1000}
            className="h-full w-full object-cover"
            priority
          />
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`h-16 w-16 shrink-0 overflow-hidden border ${
                i === activeIndex ? "border-accent" : "border-transparent"
              }`}
            >
              <Image
                src={img.src}
                alt=""
                width={128}
                height={128}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ProductDetail({
  product,
  variants,
}: {
  product: PrintifyProduct;
  variants: PrintifyProduct["variants"];
}) {
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState<number | undefined>(
    variants.find((v) => v.is_default)?.id ?? variants[0]?.id
  );
  const [added, setAdded] = useState(false);

  const selected = useMemo(
    () => variants.find((v) => v.id === variantId),
    [variants, variantId]
  );

  const images = useMemo(
    () => getVariantImages(product, variantId),
    [product, variantId]
  );

  // Only show option values that exist on an enabled variant, and hide
  // options with a single choice (e.g. "One size").
  const options = useMemo(
    () =>
      product.options
        .map((o) => ({
          ...o,
          values: o.values.filter((v) =>
            variants.some((variant) => variant.options.includes(v.id))
          ),
        }))
        .filter((o) => o.values.length > 1),
    [product.options, variants]
  );

  // Variant with `valueId` that keeps the current selection for other options.
  const findVariant = (option: PrintifyOption, valueId: number) => {
    const others = (selected?.options ?? []).filter(
      (id) => !option.values.some((v) => v.id === id)
    );
    return variants.find(
      (v) =>
        v.options.includes(valueId) &&
        others.every((id) => v.options.includes(id))
    );
  };

  // If the combination doesn't exist (e.g. size not offered in this color),
  // fall back to any variant with the chosen value.
  const selectValue = (option: PrintifyOption, valueId: number) => {
    const next =
      findVariant(option, valueId) ??
      variants.find((v) => v.options.includes(valueId));
    if (next) setVariantId(next.id);
  };

  return (
    <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-2">
      <ProductGallery
        key={images.map((img) => img.src).join()}
        images={images}
        alt={product.title}
      />

      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-xl tracking-wide">{product.title}</h1>
          {selected ? (
            <p className="mt-2 text-sm text-foreground/60">
              {formatPrice(selected.price)}
            </p>
          ) : null}
        </div>

        {product.description ? (
          <div
            className="space-y-3 text-sm leading-relaxed text-foreground/70 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{
              __html: sanitizeDescription(product.description),
            }}
          />
        ) : null}

        {options.map((option) => {
          const current = option.values.find((v) =>
            selected?.options.includes(v.id)
          );
          const isColor = option.type === "color";

          return (
            <fieldset key={option.name}>
              <legend className="mb-2 text-xs tracking-wide text-foreground/60 uppercase">
                {isColor ? "Color" : "Size"}
                {current ? (
                  <span className="text-foreground/40"> — {current.title}</span>
                ) : null}
              </legend>
              <div className="flex flex-wrap gap-2">
                {option.values.map((value) => {
                  const active = value.id === current?.id;
                  const available = !!findVariant(option, value.id);
                  return (
                    <button
                      key={value.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => selectValue(option, value.id)}
                      className={`flex items-center gap-2 border px-3 py-2 text-sm ${
                        active ? "border-accent" : "border-foreground/20"
                      } ${available ? "" : "opacity-40"}`}
                    >
                      {isColor ? (
                        <span
                          className="h-4 w-4 shrink-0 rounded-full border border-foreground/20"
                          style={{ backgroundColor: value.colors?.[0] }}
                        />
                      ) : null}
                      {value.title}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          );
        })}

        <button
          type="button"
          disabled={!selected}
          onClick={() => {
            if (!selected) return;
            addItem({
              productId: product.id,
              variantId: selected.id,
              title: product.title,
              variantTitle: selected.title,
              price: selected.price,
              image: images[0]?.src,
            });
            setAdded(true);
            setTimeout(() => setAdded(false), 1500);
          }}
          className="w-full bg-accent px-5 py-3 text-sm tracking-wide text-surface uppercase transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {added ? "Added" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
