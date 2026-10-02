import Link from "next/link";
import { getProducts } from "@/lib/printify";
import { COLLECTIONS } from "@/lib/collections";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

const ROW_SIZE = 4;

export default async function Home() {
  const products = await getProducts();

  const sections = await Promise.all(
    COLLECTIONS.map(async (collection) => ({
      collection,
      products: (await collection.select(products)).slice(0, ROW_SIZE),
    }))
  );

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
      {products.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No products published yet. Check back soon.
        </p>
      ) : (
        <div className="flex flex-col gap-16">
          {sections
            .filter((s) => s.products.length > 0)
            .map(({ collection, products }) => (
              <section key={collection.slug}>
                <div className="mb-6 flex items-baseline justify-between">
                  <h2 className="text-sm tracking-wide uppercase">
                    {collection.title}
                  </h2>
                  <Link
                    href={`/collections/${collection.slug}`}
                    className="text-xs tracking-wide text-foreground/60 uppercase hover:text-foreground"
                  >
                    View all
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            ))}
        </div>
      )}
    </main>
  );
}
