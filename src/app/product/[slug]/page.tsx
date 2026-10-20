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
import { SITE_URL } from "@/lib/site";
import { toPlainText } from "@/lib/format";

// Rebuilt in the background at most every 5 minutes, matching the Printify cache.
// Products published after a deploy are rendered on first visit, then cached.
export const revalidate = 300;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: getProductSlug(p) }));
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
    toPlainText(product.description) || `${product.title} — San Rancho`;
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
  const prices = variants.map((v) => v.price / 100);

  // Structured data so search results can show price and availability.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: toPlainText(product.description, 5000) || undefined,
    image: [
      ...new Set([getDefaultImage(product), ...product.images.map((img) => img.src)]),
    ]
      .filter(Boolean)
      .slice(0, 5),
    url: `${SITE_URL}/product/${canonicalSlug}`,
    sku: product.id,
    brand: { "@type": "Brand", name: "San Rancho" },
    offers: prices.length
      ? {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: Math.min(...prices).toFixed(2),
          highPrice: Math.max(...prices).toFixed(2),
          offerCount: variants.length,
          availability: "https://schema.org/InStock",
        }
      : undefined,
  };

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 pt-8 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <BackLink />
      <ProductDetail product={product} variants={variants} />
    </main>
  );
}
