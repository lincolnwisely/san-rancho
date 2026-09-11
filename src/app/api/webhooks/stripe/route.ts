import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createOrder, type PrintifyOrderLineItem } from "@/lib/printify";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing webhook signature" }, { status: 400 });
  }

  const body = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const lineItems: PrintifyOrderLineItem[] = JSON.parse(
      session.metadata?.line_items ?? "[]"
    );
    const details =
      session.collected_information?.shipping_details ?? session.customer_details;
    const address = details?.address;
    const [firstName, ...rest] = (details?.name ?? "Customer").split(" ");

    if (lineItems.length > 0 && address?.line1) {
      await createOrder({
        externalId: session.id,
        lineItems,
        address: {
          first_name: firstName || "Customer",
          last_name: rest.join(" ") || "-",
          email: session.customer_details?.email ?? "",
          phone: session.customer_details?.phone ?? undefined,
          country: address.country ?? "US",
          region: address.state ?? undefined,
          address1: address.line1,
          address2: address.line2 ?? undefined,
          city: address.city ?? "",
          zip: address.postal_code ?? "",
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
