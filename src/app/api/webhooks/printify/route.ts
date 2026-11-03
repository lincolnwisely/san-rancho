import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import {
  PRODUCTS_CACHE_TAG,
  getProduct,
  getProductSlug,
  markPublishingSucceeded,
} from "@/lib/printify";
import { SITE_URL } from "@/lib/site";

interface PrintifyWebhookEvent {
  id: string;
  type: string;
  resource: { id: string; type: string };
}

// Printify signs the raw body: X-Pfy-Signature: sha256=<hex HMAC-SHA256>.
function validSignature(body: string, header: string | null, secret: string) {
  if (!header) return false;
  const expected = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const secret = process.env.PRINTIFY_WEBHOOK_SECRET;
  const body = await request.text();

  const signature = request.headers.get("x-pfy-signature");

  // Unsigned or invalid requests are ignored but still get a 200: Printify
  // pings the URL when a webhook is registered and rejects it on a non-2xx.
  if (!secret || !validSignature(body, signature, secret)) {
    console.warn(
      `Printify webhook: ignored request (signature ${signature ? "invalid" : "missing"}, ${body.length}-byte body)`
    );
    return NextResponse.json({ received: false });
  }

  let event: PrintifyWebhookEvent;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ received: false });
  }

  if (event.type === "product:publish:started" || event.type === "product:deleted") {
    revalidateTag(PRODUCTS_CACHE_TAG, "max");
  }

  if (event.type === "product:publish:started") {
    const product = await getProduct(event.resource.id, { live: true });
    await markPublishingSucceeded(product.id, {
      id: product.id,
      handle: `${SITE_URL}/product/${getProductSlug(product)}`,
    });
  }

  return NextResponse.json({ received: true });
}
