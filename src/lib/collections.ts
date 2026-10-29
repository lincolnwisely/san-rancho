import type { PrintifyProduct } from "@/types/printify";
import { getUnitsSold } from "@/lib/sales";

// Shown in Popular when there aren't enough sales to rank, in this order.
const POPULAR_PICKS = [
  "6ad237120015247b110cb7ac", // Peoples Temple 1972 tour sweatshirt
  "6aa18bd72e2c82890e0b2bf4", // The end is near
  "6aba7d02403852ca3a04352f", // What if they're right sweatshirt
  "6ad23b9f51522f9ea60f4a48", // Human Individual Metamorphosis
];

// const NEW_LIMIT = 8;

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
  // {
  //   slug: "new",
  //   title: "New",
  //   description: "The latest from San Rancho.",
  //   select: async (products) =>
  //     [...products]
  //       .sort((a, b) => b.created_at.localeCompare(a.created_at))
  //       .slice(0, NEW_LIMIT),
  // },
  {
    slug: "popular",
    title: "Popular",
    description: "Best-selling cult tees, hoodies & accessories from San Rancho.",
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
    description: "Cult-themed t-shirts and long sleeves. Deconversion humor, classic cults, dark satire. Printed on demand, free US shipping.",
    select: byTags("T-shirts", "Long Sleeves"),
  },
  {
    slug: "sweatshirts",
    title: "Sweatshirts",
    description: "Cult hoodies and crewneck sweatshirts. Minimalist design, printed on demand, free US shipping.",
    select: byTags("Sweatshirts", "Hoodies"),
  },
  {
    slug: "accessories",
    title: "Accessories",
    description: "Cult-themed mugs, stickers, magnets & hats from San Rancho.",
    select: byTags("Accessories", "Mugs", "Stickers"),
  },
];

export function getCollection(slug: string) {
  return COLLECTIONS.find((c) => c.slug === slug);
}
