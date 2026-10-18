// GA4 ecommerce events. Prices come in as cents and are sent as dollars.

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

interface AnalyticsItem {
  productId: string;
  title: string;
  variantTitle?: string;
  price: number; // cents
  quantity?: number;
}

// Same queueing as the gtag() stub in the root layout, so events sent before
// gtag.js finishes loading are still delivered.
function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  // gtag.js only reads queued Arguments objects, not plain arrays.
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
  void args;
}

export function trackEcommerce(
  event: "view_item" | "add_to_cart" | "begin_checkout" | "purchase",
  items: AnalyticsItem[],
  extra: Record<string, unknown> = {}
) {
  const value = items.reduce((sum, i) => sum + i.price * (i.quantity ?? 1), 0);
  gtag("event", event, {
    currency: "USD",
    value: value / 100,
    items: items.map((i) => ({
      item_id: i.productId,
      item_name: i.title,
      item_variant: i.variantTitle,
      price: i.price / 100,
      quantity: i.quantity ?? 1,
    })),
    ...extra,
  });
}
