import { unstable_cache } from "next/cache";
import { getStripe } from "@/lib/stripe";
import type { PrintifyOrderLineItem } from "@/lib/printify";

const WINDOW_DAYS = 90;

// Units sold per Printify product id over the last WINDOW_DAYS, tallied from
// paid Stripe Checkout sessions (see metadata.line_items in api/checkout).
// Cached so the homepage doesn't page through Stripe per request. The Stripe
// webhook invalidates the tag after each sale; the daily revalidate is a
// fallback (and keeps the 90-day window moving).
export const UNITS_SOLD_CACHE_TAG = "units-sold";

export const getUnitsSold = unstable_cache(
  async (): Promise<Record<string, number>> => {
    const since = Math.floor(Date.now() / 1000) - WINDOW_DAYS * 24 * 60 * 60;
    const units: Record<string, number> = {};

    for await (const session of getStripe().checkout.sessions.list({
      status: "complete",
      created: { gte: since },
      limit: 100,
    })) {
      if (session.payment_status !== "paid") continue;
      const items: PrintifyOrderLineItem[] = JSON.parse(
        session.metadata?.line_items ?? "[]"
      );
      for (const item of items) {
        units[item.product_id] = (units[item.product_id] ?? 0) + item.quantity;
      }
    }

    return units;
  },
  ["units-sold"],
  { revalidate: 86400, tags: [UNITS_SOLD_CACHE_TAG] }
);
