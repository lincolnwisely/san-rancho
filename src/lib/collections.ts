import type { PrintifyProduct } from "@/types/printify";

// const NEW_LIMIT = 8;

export interface Collection {
  slug: string;
  title: string;
  // Keyword-bearing name for the collection page's <title> and <h1>.
  heading: string;
  description: string;
  select: (products: PrintifyProduct[]) => Promise<PrintifyProduct[]>;
}

// Printify tags products by type automatically (e.g. "T-shirts", "Mugs").
const byTags =
  (...tags: string[]) =>
    async (products: PrintifyProduct[]) =>
      products.filter((p) => tags.some((t) => p.tags.includes(t)));

// Lowercase, strip accents and apostrophes, so "Heaven's Gate" and
// "Heavens Gate" both match "heavens gate", and "Apôtres" matches "apotres".
const normalize = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/['’]/g, "").toLowerCase();

const titleHasAny = (product: PrintifyProduct, terms: string[]) =>
  terms.some((t) => normalize(product.title).includes(t));

// Printify's editor has no custom tags, so cult collections match on title.
// To file a new product, put the name in its title (or add a term here).
const HEAVENS_GATE = ["heavens gate"];
const PEOPLES_TEMPLE = ["peoples temple"];
const SAN_RANCHO = ["san rancho", "cult hotline"];
const MORE_CULTS = ["apostles of infinite love", "apotres de lamour infini", "penitentes", "family reunion", "nxivm"];
const ALL_CULT_TERMS = [...HEAVENS_GATE, ...PEOPLES_TEMPLE, ...SAN_RANCHO, ...MORE_CULTS];

const byTitle =
  (terms: string[]) =>
    async (products: PrintifyProduct[]) =>
      products.filter((p) => titleHasAny(p, terms));

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
    slug: "heavens-gate",
    title: "Heaven's Gate",
    heading: "Heaven's Gate Shirts, Hoodies & Merch",
    description: "Minimalist Heaven's Gate shirts, hoodies and mugs. Away Team, Higher Source, the HIM tour and more. Printed on demand, free US shipping.",
    select: byTitle(HEAVENS_GATE),
  },
  {
    slug: "peoples-temple",
    title: "Peoples Temple",
    heading: "Peoples Temple Shirts & Sweatshirts",
    description: "Pre-Jonestown Peoples Temple tour tees, hoodies and sweatshirts. Minimalist designs, printed on demand, free US shipping.",
    select: byTitle(PEOPLES_TEMPLE),
  },
  {
    slug: "san-rancho",
    title: "San Rancho",
    heading: "San Rancho Societies, Clubs & Camps",
    description: "Official-ish merch from the San Rancho Deconversion Society, Tennis Club, Birding Society, Cult Hotline and more. Free US shipping.",
    select: byTitle(SAN_RANCHO),
  },
  {
    slug: "more-cults",
    title: "More Cults",
    heading: "More Cult Shirts & Sweatshirts",
    description: "Tees and sweatshirts for more cults: NXIVM, the Apostles of Infinite Love, Los Penitentes, The Family and more. Free US shipping.",
    select: byTitle(MORE_CULTS),
  },
  {
    slug: "cult-agnostic",
    title: "Cult-Agnostic",
    heading: "Cult-Agnostic Tees, Hoodies & Mugs",
    description: "End-times dread, deconversion humor and fictional institutions. No specific cult required. Printed on demand, free US shipping.",
    // Everything that isn't filed under a cult above.
    select: async (products) => products.filter((p) => !titleHasAny(p, ALL_CULT_TERMS)),
  },
  {
    slug: "tees",
    title: "Tees",
    heading: "Cult T-Shirts & Long Sleeves",
    description: "Cult-themed t-shirts and long sleeves. Deconversion humor, classic cults, dark satire. Printed on demand, free US shipping.",
    select: byTags("T-shirts", "Long Sleeves"),
  },
  {
    slug: "sweatshirts",
    title: "Sweatshirts",
    heading: "Cult Hoodies & Sweatshirts",
    description: "Cult hoodies and crewneck sweatshirts. Minimalist design, printed on demand, free US shipping.",
    select: byTags("Sweatshirts", "Hoodies"),
  },
  {
    slug: "accessories",
    title: "Accessories",
    heading: "Cult Mugs, Stickers & Hats",
    description: "Cult-themed mugs, stickers, magnets & hats from San Rancho.",
    select: byTags("Accessories", "Mugs", "Stickers"),
  },
];

export function getCollection(slug: string) {
  return COLLECTIONS.find((c) => c.slug === slug);
}
