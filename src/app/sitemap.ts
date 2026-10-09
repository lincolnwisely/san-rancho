import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getProducts, getProductSlug } from "@/lib/printify";
import { SITE_URL } from "@/lib/site";
import { COLLECTIONS } from "@/lib/collections";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Render at request time so the build never depends on the Printify API.
  await connection();
  const products = await getProducts();

  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...COLLECTIONS.map((collection) => ({
      url: `${SITE_URL}/collections/${collection.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...products.map((product) => ({
      url: `${SITE_URL}/product/${getProductSlug(product)}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
