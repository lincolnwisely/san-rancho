import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/printify";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...products.map((product) => ({
      url: `${SITE_URL}/product/${product.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
