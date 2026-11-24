import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import {
  getProduct,
  getEnabledVariants,
  getDefaultImage,
  getProducts,
  getProductSlug,
  getProductIdFromSlug,
  crawlableImageUrl,
} from "@/lib/printify";
import { ProductDetail } from "@/components/ProductDetail";
import { BackLink } from "@/components/BackLink";
import { RelatedProducts } from "@/components/RelatedProducts";
import { SITE_URL } from "@/lib/site";
import { COLLECTIONS } from "@/lib/collections";
import { toPlainText } from "@/lib/format";

// Rebuilt when the Printify webhook invalidates the product cache; daily fallback.
// Products published after a deploy are rendered on first visit, then cached.
export const revalidate = 86400;

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

  // Use only our own blurb, not Printify's "Product Overview" boilerplate after it.
  const description =
    toPlainText(product.description.split("Product Overview")[0]) ||
    toPlainText(product.description) ||
    `${product.title} — San Rancho`;
  const image = getDefaultImage(product);

  return {
    title: product.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: product.title,
      description,
      url: path,
      images: image ? [crawlableImageUrl(image)] : undefined,
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
      .filter((src) => src !== undefined)
      .slice(0, 5)
      .map(crawlableImageUrl),
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
          // Shipping is folded into prices: free to the US, the only place we ship.
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "USD" },
            shippingDestination: { "@type": "DefinedRegion", addressCountry: "US" },
          },
        }
      : undefined,
  };

  // Home › first matching collection (skipping Popular, which is sales-based) › product.
  const collection = (
    await Promise.all(
      COLLECTIONS.filter((c) => c.slug !== "popular").map(async (c) =>
        (await c.select([product])).length ? c : null
      )
    )
  ).find((c) => c !== null);
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: "Home", item: SITE_URL },
      ...(collection
        ? [{ name: collection.heading, item: `${SITE_URL}/collections/${collection.slug}` }]
        : []),
      { name: product.title, item: `${SITE_URL}/product/${canonicalSlug}` },
    ].map((crumb, i) => ({ "@type": "ListItem", position: i + 1, ...crumb })),
  };

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 pt-8 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLd).replace(/</g, "\\u003c"),
        }}
      />
      <BackLink />
      <ProductDetail product={product} variants={variants} />
      <RelatedProducts product={product} />
    </main>
  );
}
