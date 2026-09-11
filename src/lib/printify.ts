import type { PrintifyProduct, PrintifyProductsResponse } from "@/types/printify";

const API_BASE = "https://api.printify.com/v1";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

async function printifyFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = requireEnv("PRINTIFY_API_TOKEN");
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
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

export async function getProducts(): Promise<PrintifyProduct[]> {
  const shopId = await getShopId();
  const data = await printifyFetch<PrintifyProductsResponse>(
    `/shops/${shopId}/products.json`
  );
  return data.data.filter((p) => p.visible);
}

export async function getProduct(productId: string): Promise<PrintifyProduct> {
  const shopId = await getShopId();
  return printifyFetch<PrintifyProduct>(
    `/shops/${shopId}/products/${productId}.json`
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
