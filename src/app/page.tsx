import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/printify";
import { COLLECTIONS } from "@/lib/collections";
import { ProductCard } from "@/components/ProductCard";
import heroImg from "../../public/hero/sweatshirts.png";

export const metadata: Metadata = {
  title: { absolute: "Cult T-Shirts, Hoodies & Merch — San Rancho" },
  description: "Shop irreverent cult-themed tees, hoodies & accessories. Heaven's Gate, People's Temple, deconversion humor. Free US shipping.",
  alternates: { canonical: "/" },
};
// Rebuilt in the background at most every 5 minutes, matching the Printify cache.
export const revalidate = 300;

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
    <main className="w-full flex-1">
      <Link href="/collections/sweatshirts" className="relative block w-full h-[480px] overflow-hidden group">
        <Image
          src={heroImg}
          alt="San Rancho hoodie"
          fill
          className="object-cover transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center px-6">
          {/* <p className="text-xs tracking-widest uppercase font-mono mb-4 font-bold">New arrivals</p> */}
          <h2 className="text-3xl sm:text-4xl tracking-tight mb-6 font-bold">Made for members only.</h2>
          <span className="bg-white text-black border border-white px-6 py-2 text-xs tracking-widest uppercase font-mono [@media(hover:hover)]:group-hover:bg-transparent [@media(hover:hover)]:group-hover:text-white transition-colors">
            Shop Sweatshirts
          </span>
        </div>
      </Link>

      <div className="mx-auto w-full max-w-5xl px-6 py-10">

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
                      className="text-xs tracking-wide text-foreground/60 uppercase hover:text-foreground font-mono"
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
      </div>
    </main>
  );
}
