import Link from "next/link";
import Image from "next/image";
import type { PrintifyProduct } from "@/types/printify";
import { getDefaultImage, getEnabledVariants } from "@/lib/printify";
import { formatPrice } from "@/lib/format";

export function ProductCard({ product }: { product: PrintifyProduct }) {
  const image = getDefaultImage(product);
  const variants = getEnabledVariants(product);
  const prices = variants.map((v) => v.price);
  const minPrice = prices.length ? Math.min(...prices) : undefined;

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="aspect-square w-full overflow-hidden bg-surface">
        {image ? (
          <Image
            src={image}
            alt={product.title}
            width={800}
            height={800}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <h2 className="text-sm tracking-wide">{product.title}</h2>
        {minPrice !== undefined ? (
          <span className="text-sm text-foreground/60">{formatPrice(minPrice)}</span>
        ) : null}
      </div>
    </Link>
  );
}
