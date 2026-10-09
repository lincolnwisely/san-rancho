import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/printify";
import { COLLECTIONS, getCollection } from "@/lib/collections";
import { ProductCard } from "@/components/ProductCard";
import { BackLink } from "@/components/BackLink";

// Rebuilt in the background at most every 5 minutes, matching the Printify cache.
export const revalidate = 300;

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return {};

  return {
    title: collection.title,
    description: collection.description,
    alternates: { canonical: `/collections/${slug}` },
  };
}

export default async function CollectionPage({
  params,
}: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const products = await collection.select(await getProducts());

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 pt-8 pb-16">
      <BackLink />
      <h1 className="mt-8 mb-12 text-sm tracking-wide uppercase">
        {collection.title}
      </h1>
      {products.length === 0 ? (
        <p className="text-sm text-zinc-500">Nothing here yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
