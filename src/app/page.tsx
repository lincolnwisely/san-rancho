import { getProducts } from "@/lib/printify";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();
  return (
    <main className="mx-auto max-w-5xl flex-1 px-6 py-16">
      {products.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No products published yet. Check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
