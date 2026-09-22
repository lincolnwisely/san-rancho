import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProduct,
  getEnabledVariants,
  getDefaultImage,
} from "@/lib/printify";
import { ProductDetail } from "@/components/ProductDetail";

export const dynamic = "force-dynamic";

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
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const product = await getProduct(id).catch(() => null);
  if (!product) return {};

  const description =
    toMetaDescription(product.description) || `${product.title} — San Rancho`;
  const image = getDefaultImage(product);

  return {
    title: product.title,
    description,
    alternates: { canonical: `/product/${id}` },
    openGraph: {
      title: product.title,
      description,
      url: `/product/${id}`,
      images: image ? [image] : undefined,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProduct(id).catch(() => null);
  if (!product) notFound();

  const variants = getEnabledVariants(product);

  return <ProductDetail product={product} variants={variants} />;
}
