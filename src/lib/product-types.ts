import type { PrintifyProduct } from "@/types/printify";

// Product type by Printify's automatic tag: `name` is added to feed titles
// that don't already say what the product is (any `keywords` match), and
// `category` is the Google product category id
// (https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt).
export const PRODUCT_TYPES = [
  { tag: "Long Sleeves", name: "Long Sleeve Tee", keywords: ["long sleeve"], category: "212" },
  { tag: "T-shirts", name: "Tee", keywords: ["tee", "shirt"], category: "212" },
  { tag: "Sweatshirts", name: "Sweatshirt", keywords: ["sweatshirt", "crewneck"], category: "212" },
  { tag: "Hoodies", name: "Hoodie", keywords: ["hoodie"], category: "212" },
  { tag: "Hats", name: "Hat", keywords: ["hat", "cap"], category: "173" },
  { tag: "Mugs", name: "Mug", keywords: ["mug"], category: "2169" },
  { tag: "Stickers", name: "Sticker", keywords: ["sticker"], category: "4054" },
  { tag: "Magnets", name: "Magnet", keywords: ["magnet"], category: "5876" },
];

export type ProductType = (typeof PRODUCT_TYPES)[number];

export function getProductType(product: Pick<PrintifyProduct, "tags">) {
  return PRODUCT_TYPES.find((t) => product.tags.includes(t.tag));
}

// Longest first so "sweatshirt" is removed before "shirt" can match inside it.
const TYPE_WORDS = PRODUCT_TYPES.flatMap((t) => t.keywords).sort(
  (a, b) => b.length - a.length
);

// The title without product-type words, so the same design on different
// garments compares equal: "Heaven's Gate Higher Source tee" and
// "Heaven's Gate Higher Source sweatshirt" -> "heavens gate higher source".
export function getDesignName(title: string) {
  let name = title
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " "); // "long-sleeve" -> "long sleeve"
  for (const word of TYPE_WORDS) {
    name = name.replace(new RegExp(`\\b${word}s?\\b`, "g"), " ");
  }
  return name.replace(/\s+/g, " ").trim();
}
