// import Link from "next/link";
import { getProducts } from "@/lib/printify";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: PageProps<"/">) {
  const { tag: activeTag } = await searchParams;
  const products = await getProducts();

  // const tags = Array.from(new Set(products.flatMap((p) => p.tags))).sort();
  const visibleProducts = activeTag
    ? products.filter((p) => p.tags.includes(activeTag as string))
    : products;

  return (
    <main className="mx-auto max-w-5xl flex-1 px-6 py-16">
      {/* {tags.length > 0 ? (
        <div className="mb-12 flex flex-wrap gap-x-6 gap-y-2">
          <Link
            href="/"
            className={`text-sm tracking-wide uppercase ${activeTag ? "text-foreground/60" : "text-foreground"
              }`}
          >
            All
          </Link>
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/?tag=${encodeURIComponent(tag)}`}
              className={`text-sm tracking-wide uppercase ${activeTag === tag ? "text-foreground" : "text-foreground/60"
                }`}
            >
              {tag}
            </Link>
          ))}
        </div>
      ) : null} */}

      {visibleProducts.length === 0 ? (
        <p className="text-sm text-zinc-500">
          {activeTag ? "No products with this tag." : "No products published yet. Check back soon."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
