"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { PrintifyImage, PrintifyProduct } from "@/types/printify";
import { useCart } from "@/lib/cart-context";
import { getVariantImages } from "@/lib/printify";
import { formatPrice } from "@/lib/format";

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

  return (
    <div className="mx-auto grid max-w-5xl flex-1 grid-cols-1 gap-12 px-6 py-16 md:grid-cols-2">
      <ProductGallery key={variantId} images={images} alt={product.title} />

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
          <p className="text-sm leading-relaxed text-foreground/70">
            {product.description.replace(/<[^>]*>/g, "")}
          </p>
        ) : null}

        {variants.length > 1 ? (
          <div>
            <label
              htmlFor="variant"
              className="mb-2 block text-xs tracking-wide text-foreground/60 uppercase"
            >
              Option
            </label>
            <select
              id="variant"
              value={variantId}
              onChange={(e) => setVariantId(Number(e.target.value))}
              className="w-full border border-foreground/20 bg-transparent px-3 py-2 text-sm"
            >
              {variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.title}
                </option>
              ))}
            </select>
          </div>
        ) : null}

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
