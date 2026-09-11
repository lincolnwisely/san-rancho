import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getProduct, getEnabledVariants } from "@/lib/printify";

interface CheckoutItem {
  productId: string;
  variantId: number;
  quantity: number;
}

export async function POST(request: Request) {
  const { items } = (await request.json()) as { items: CheckoutItem[] };

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const productCache = new Map<string, Awaited<ReturnType<typeof getProduct>>>();

  const lineItems = [];
  const orderLineItems = [];

  for (const item of items) {
    if (!productCache.has(item.productId)) {
      productCache.set(item.productId, await getProduct(item.productId));
    }
    const product = productCache.get(item.productId)!;
    const variant = getEnabledVariants(product).find((v) => v.id === item.variantId);

    if (!variant) {
      return NextResponse.json(
        { error: `Variant unavailable: ${item.variantId}` },
        { status: 400 }
      );
    }

    const quantity = Math.max(1, Math.floor(item.quantity));

    lineItems.push({
      quantity,
      price_data: {
        currency: "usd",
        unit_amount: variant.price,
        product_data: {
          name: `${product.title} — ${variant.title}`,
        },
      },
    });

    orderLineItems.push({
      product_id: item.productId,
      variant_id: item.variantId,
      quantity,
    });
  }

  const origin = request.headers.get("origin") ?? new URL(request.url).origin;

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    shipping_address_collection: { allowed_countries: ["US", "CA"] },
    phone_number_collection: { enabled: true },
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
    metadata: {
      line_items: JSON.stringify(orderLineItems),
    },
  });

  if (!session.url) {
    return NextResponse.json({ error: "Could not start checkout" }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
