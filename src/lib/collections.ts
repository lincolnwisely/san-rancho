import type { PrintifyProduct } from "@/types/printify";
import { getUnitsSold } from "@/lib/sales";

// Shown in Popular when there aren't enough sales to rank, in this order.
const POPULAR_PICKS = [
  "6aa6e108b02ef80c0b04de45", // Lucky me
  "6aa41c9fa512d344840fc322", // San Rancho Birding Society
  "6aa18bd72e2c82890e0b2bf4", // The end is near
  "6ab7d6f9db3d85977c0214c6", // What if they're right hoodie
];

const NEW_LIMIT = 8;

export interface Collection {
  slug: string;
  title: string;
  description: string;
  select: (products: PrintifyProduct[]) => Promise<PrintifyProduct[]>;
}

// Printify tags products by type automatically (e.g. "T-shirts", "Mugs").
const byTags =
  (...tags: string[]) =>
  async (products: PrintifyProduct[]) =>
    products.filter((p) => tags.some((t) => p.tags.includes(t)));

export const COLLECTIONS: Collection[] = [
  {
    slug: "new",
    title: "New",
    description: "The latest from San Rancho.",
    select: async (products) =>
      [...products]
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .slice(0, NEW_LIMIT),
  },
  {
    slug: "popular",
    title: "Popular",
    description: "What people are buying from San Rancho.",
    // Best sellers first, then hand-picks to fill in until sales catch up.
    select: async (products) => {
      const sold = await getUnitsSold().catch((err) => {
        console.error("Failed to load sales for Popular:", err);
        return {} as Record<string, number>;
      });
      const ranked = products
        .filter((p) => sold[p.id])
        .sort((a, b) => sold[b.id] - sold[a.id]);
      const picks = POPULAR_PICKS.map((id) =>
        products.find((p) => p.id === id)
      ).filter((p): p is PrintifyProduct => !!p && !ranked.includes(p));
      return [...ranked, ...picks];
    },
  },
  {
    slug: "tees",
    title: "Tees",
    description: "San Rancho t-shirts.",
    select: byTags("T-shirts"),
  },
  {
    slug: "sweatshirts",
    title: "Sweatshirts",
    description: "San Rancho sweatshirts and hoodies.",
    select: byTags("Sweatshirts", "Hoodies"),
  },
  {
    slug: "accessories",
    title: "Accessories",
    description: "San Rancho hats, mugs, and more.",
    select: byTags("Accessories", "Mugs"),
  },
];

export function getCollection(slug: string) {
  return COLLECTIONS.find((c) => c.slug === slug);
}
