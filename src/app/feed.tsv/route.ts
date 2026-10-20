import { getProducts, getProductSlug, getVariantImages } from "@/lib/printify";
import { SAMPLE_PHOTOS } from "@/lib/sample-photos";
import { toPlainText } from "@/lib/format";
import { SITE_URL } from "@/lib/site";

// Google Merchant Center product feed, one row per enabled variant.
// Merchant Center fetches this URL on a schedule, so it stays in sync with
// Printify without a spreadsheet.
export const revalidate = 3600;

const COLUMNS = [
  "id",
  "item_group_id",
  "title",
  "description",
  "link",
  "image_link",
  "additional_image_link",
  "availability",
  "price",
  "brand",
  "identifier_exists",
  "condition",
  "adult",
  "color",
  "size",
  "gender",
  "age_group",
] as const;

// Printify's automatic type tags for clothing and hats.
const APPAREL_TAGS = ["Men's Clothing", "Women's Clothing", "Hats"];

// Tabs and newlines would break the row.
const clean = (value: string) => value.replace(/\s+/g, " ").trim();

export async function GET() {
  const products = await getProducts();
  const rows: string[][] = [[...COLUMNS]];

  for (const product of products) {
    const slug = getProductSlug(product);
    const description = toPlainText(product.description, 5000) || product.title;
    const isApparel = product.tags.some((t) => APPAREL_TAGS.includes(t));
    const samples = (SAMPLE_PHOTOS[product.id] ?? []).map((src) => SITE_URL + src);

    // Option value id -> title, per option type ("color", "size", ...).
    const valueTitle = (variantOptions: number[], type: string) => {
      const option = product.options.find((o) => o.type === type);
      return (
        option?.values.find((v) => variantOptions.includes(v.id))?.title ?? ""
      );
    };

    for (const variant of product.variants) {
      const images = [
        ...getVariantImages(product, variant.id).map((img) => img.src),
        ...samples,
      ];
      const row: Record<(typeof COLUMNS)[number], string> = {
        id: `${product.id}_${variant.id}`,
        item_group_id: product.id,
        title: `${product.title} - ${variant.title}`,
        description,
        link: `${SITE_URL}/product/${slug}?variant=${variant.id}`,
        image_link: images[0] ?? "",
        additional_image_link: images.slice(1, 11).join(","),
        availability: "in_stock",
        price: `${(variant.price / 100).toFixed(2)} USD`,
        brand: "San Rancho",
        identifier_exists: "no",
        condition: "new",
        adult: "no",
        color: valueTitle(variant.options, "color"),
        size: valueTitle(variant.options, "size"),
        gender: isApparel ? "unisex" : "",
        age_group: isApparel ? "adult" : "",
      };
      rows.push(COLUMNS.map((c) => clean(row[c])));
    }
  }

  return new Response(rows.map((r) => r.join("\t")).join("\n") + "\n", {
    headers: { "Content-Type": "text/tab-separated-values; charset=utf-8" },
  });
}
