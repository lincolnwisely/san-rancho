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
  "&lt;": "<",
  "&gt;": ">",
  "&apos;": "'",
  "&ndash;": "–",
  "&mdash;": "—",
  "&hellip;": "…",
  "&reg;": "®",
  "&trade;": "™",
  "&copy;": "©",
  "&deg;": "°",
  "&sup2;": "²",
  "&sup3;": "³",
  "&frac12;": "½",
  "&times;": "×",
};

// Named entities from the table above, plus any numeric one ("&#8217;", "&#x2019;").
function decodeEntity(entity: string): string {
  const numeric = /^&#(x?)([0-9a-f]+);$/i.exec(entity);
  if (numeric) {
    const code = parseInt(numeric[2], numeric[1] ? 16 : 10);
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : entity;
  }
  return ENTITIES[entity.toLowerCase()] ?? entity;
}

function toMetaDescription(html: string, max = 160): string {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, decodeEntity)
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
  const prices = variants.map((v) => v.price / 100);

  // Structured data so search results can show price and availability.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: toMetaDescription(product.description, 5000) || undefined,
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
