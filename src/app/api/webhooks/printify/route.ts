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

  if (!secret || !validSignature(body, request.headers.get("x-pfy-signature"), secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body) as PrintifyWebhookEvent;

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
