import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getProducts, getProductSlug } from "@/lib/printify";
import { SITE_URL } from "@/lib/site";
import { COLLECTIONS } from "@/lib/collections";

function toDate(printifyDate?: string): Date | undefined {
  if (!printifyDate) return undefined;
  const date = new Date(printifyDate.replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Render at request time so the build never depends on the Printify API.
  await connection();
  const products = await getProducts();
  console.log(Object.keys(products[0]), products[0].updated_at);
  const productEntries = products.map((product) => ({
    url: `${SITE_URL}/product/${getProductSlug(product)}`,
    lastModified: toDate(product.updated_at),
  }));

  // Home and collection pages change whenever any product does.
  const latestProductUpdate = productEntries
    .map((entry) => entry.lastModified)
    .filter((d): d is Date => d !== undefined)
    .sort((a, b) => b.getTime() - a.getTime())[0];

  return [
    { url: SITE_URL, lastModified: latestProductUpdate },
    ...COLLECTIONS.map((collection) => ({
      url: `${SITE_URL}/collections/${collection.slug}`,
      lastModified: latestProductUpdate,
    })),
    ...productEntries,
    { url: `${SITE_URL}/about` },
    { url: `${SITE_URL}/privacy` },
    { url: `${SITE_URL}/terms` },
  ];
}