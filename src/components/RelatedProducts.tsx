import type { PrintifyProduct } from "@/types/printify";
import { getProducts } from "@/lib/printify";
import { getDesignName, getProductType } from "@/lib/product-types";
import { ProductCard } from "@/components/ProductCard";

const LIMIT = 4;

// The same design on other garments first, then more of the same type, then
// anything else so small types (mugs, stickers) still fill the row.
function selectRelated(product: PrintifyProduct, products: PrintifyProduct[]) {
  // Start after the current product (wrapping around) so each page shows
  // different neighbors instead of the same first few of a type.
  const index = products.findIndex((p) => p.id === product.id);
  const others = [...products.slice(index + 1), ...products.slice(0, index)].filter(
    (p) => p.id !== product.id
  );

  const design = getDesignName(product.title);
  const sameDesign = others.filter((p) => getDesignName(p.title) === design);

  const type = getProductType(product);
  const sameType = type
    ? others.filter((p) => !sameDesign.includes(p) && p.tags.includes(type.tag))
    : [];

  return [...new Set([...sameDesign, ...sameType, ...others])].slice(0, LIMIT);
}

export async function RelatedProducts({ product }: { product: PrintifyProduct }) {
  const related = selectRelated(product, await getProducts());
  if (related.length === 0) return null;

  return (
    <section className="mt-24">
      <h2 className="mb-6 text-sm tracking-wide uppercase">You might also like</h2>
      <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
        {related.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
