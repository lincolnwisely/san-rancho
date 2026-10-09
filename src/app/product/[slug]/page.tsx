import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import {
  getProduct,
  getEnabledVariants,
  getDefaultImage,
  getProducts,
  getProductSlug,
  getProductIdFromSlug,
} from "@/lib/printify";
import { ProductDetail } from "@/components/ProductDetail";
import { BackLink } from "@/components/BackLink";

// Rebuilt in the background at most every 5 minutes, matching the Printify cache.
// Products published after a deploy are rendered on first visit, then cached.
export const revalidate = 300;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: getProductSlug(p) }));
}

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
  "&ldquo;": "“",
  "&rdquo;": "”",
  "&lsquo;": "‘",
  "&rsquo;": "’",
};

function toMetaDescription(html: string, max = 160): string {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, (e) => ENTITIES[e] ?? e)
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const product = await getProduct(getProductIdFromSlug(slug)).catch(() => null);
  if (!product) return {};

  const path = `/product/${getProductSlug(product)}`;

  const description =
    toMetaDescription(product.description) || `${product.title} — San Rancho`;
  const image = getDefaultImage(product);

  return {
    title: product.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: product.title,
      description,
      url: path,
      images: image ? [image] : undefined,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProduct(getProductIdFromSlug(slug)).catch(() => null);
  if (!product) notFound();

  // Old id-only links and renamed products land on the current slug.
  const canonicalSlug = getProductSlug(product);
  if (slug !== canonicalSlug) permanentRedirect(`/product/${canonicalSlug}`);

  const variants = getEnabledVariants(product);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 pt-8 pb-16">
      <BackLink />
      <ProductDetail product={product} variants={variants} />
    </main>
  );
}
