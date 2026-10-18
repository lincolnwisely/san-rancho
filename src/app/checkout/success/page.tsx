"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { trackEcommerce } from "@/lib/analytics";

export default function CheckoutSuccessPage() {
  const { items, clear, hydrated } = useCart();

  // Wait for the cart to load from storage so the purchase event has its
  // items. A reload finds an empty cart, so the purchase isn't counted twice.
  useEffect(() => {
    if (!hydrated) return;
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (sessionId && items.length > 0) {
      trackEcommerce("purchase", items, { transaction_id: sessionId });
    }
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-6 py-32 text-center">
      <h1 className="text-lg tracking-wide text-accent-secondary uppercase">
        Thank you
      </h1>
      <p className="mt-4 text-sm text-foreground/60">
        Your order has been placed. A confirmation email is on its way.
      </p>
    </main>
  );
}
