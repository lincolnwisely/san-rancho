import { unstable_cache } from "next/cache";
import type { PrintifyProduct, PrintifyProductsResponse } from "@/types/printify";

const API_BASE = "https://api.printify.com/v1";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Storefront reads are cached for 5 minutes; checkout and order creation always hit Printify live.
const STOREFRONT_REVALIDATE_SECONDS = 300;

async function printifyFetch<T>(
  path: string,
  init?: RequestInit,
  { cached = false }: { cached?: boolean } = {}
): Promise<T> {
  const token = requireEnv("PRINTIFY_API_TOKEN");
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...(cached
      ? { cache: "force-cache", next: { revalidate: STOREFRONT_REVALIDATE_SECONDS } }
      : { cache: "no-store" }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Printify API error (${res.status}): ${body}`);
  }

  return res.json() as Promise<T>;
}

export async function getShopId(): Promise<string> {
  return requireEnv("PRINTIFY_SHOP_ID");
}

// Keep only the fields the storefront reads. The raw list (~3 MB, mostly
// variants that aren't enabled) is over the 2 MB data cache limit.
function toStorefrontProduct(p: PrintifyProduct): PrintifyProduct {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    visible: p.visible,
    tags: p.tags,
    created_at: p.created_at,
    images: p.images.map(({ src, variant_ids, position, is_default }) => ({
      src,
      variant_ids,
      position,
      is_default,
    })),
    variants: getEnabledVariants(p).map(
      ({ id, title, price, is_enabled, is_available, is_default, options }) => ({
        id,
        title,
        price,
        is_enabled,
        is_available,
        is_default,
        options,
      })
    ),
    options: p.options.map(({ name, type, values }) => ({
      name,
      type,
      values: values.map(({ id, title, colors }) => ({ id, title, colors })),
    })),
  };
}

export const getProducts = unstable_cache(
  async (): Promise<PrintifyProduct[]> => {
    const shopId = await getShopId();
    const data = await printifyFetch<PrintifyProductsResponse>(
      `/shops/${shopId}/products.json`
    );
    return data.data.filter((p) => p.visible).map(toStorefrontProduct);
  },
  ["printify-products"],
  { revalidate: STOREFRONT_REVALIDATE_SECONDS }
);

export async function getProduct(
  productId: string,
  { live = false }: { live?: boolean } = {}
): Promise<PrintifyProduct> {
  const shopId = await getShopId();
  return printifyFetch<PrintifyProduct>(
    `/shops/${shopId}/products/${productId}.json`,
    undefined,
    { cached: !live }
  );
}

export interface PrintifyOrderLineItem {
  product_id: string;
  variant_id: number;
  quantity: number;
}

export interface PrintifyShippingAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country: string;
  region?: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
}

export async function createOrder(params: {
  externalId: string;
  lineItems: PrintifyOrderLineItem[];
  address: PrintifyShippingAddress;
}): Promise<{ id: string }> {
  const shopId = await getShopId();
  return printifyFetch<{ id: string }>(`/shops/${shopId}/orders.json`, {
    method: "POST",
    body: JSON.stringify({
      external_id: params.externalId,
      label: params.externalId,
      line_items: params.lineItems,
      shipping_method: 1,
      send_shipping_notification: true,
      address_to: params.address,
    }),
  });
}

// Product URLs are "<title>-<id>" (e.g. "lucky-me-6aa6e108b02ef80c0b04de45").
// The page looks products up by the id, so renaming a product doesn't break
// old links; they redirect to the current slug.
export function getProductSlug(product: Pick<PrintifyProduct, "id" | "title">) {
  const name = product.title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/['\u2019]/g, "") // "world's" -> "worlds"
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return name ? `${name}-${product.id}` : product.id;
}

// Printify ids have no hyphens, so the id is whatever follows the last one.
// Bare ids (the old URL format) pass through unchanged.
export function getProductIdFromSlug(slug: string) {
  return slug.slice(slug.lastIndexOf("-") + 1);
}

export function getDefaultImage(product: PrintifyProduct): string | undefined {
  return (
    product.images.find((img) => img.is_default)?.src ?? product.images[0]?.src
  );
}

const IMAGE_POSITION_ORDER: Record<string, number> = { front: 0, back: 1 };

export function getVariantImages(
  product: PrintifyProduct,
  variantId?: number
) {
  const matches = variantId
    ? product.images.filter((img) => img.variant_ids.includes(variantId))
    : [];
  const images = matches.length > 0 ? matches : product.images;

  return [...images].sort(
    (a, b) =>
      (IMAGE_POSITION_ORDER[a.position] ?? 2) -
      (IMAGE_POSITION_ORDER[b.position] ?? 2)
  );
}

export function getEnabledVariants(product: PrintifyProduct) {
  return product.variants.filter((v) => v.is_enabled && v.is_available);
}
