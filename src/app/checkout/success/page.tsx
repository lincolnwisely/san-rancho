"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-context";

export default function CheckoutSuccessPage() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
