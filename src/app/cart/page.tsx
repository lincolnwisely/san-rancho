"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) throw new Error("Checkout failed. Please try again.");
      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl flex-1 px-6 py-16">
        <p className="text-sm text-foreground/60">Your cart is empty.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl flex-1 px-6 py-16">
      <h1 className="mb-8 text-lg tracking-wide uppercase">Cart</h1>

      <ul className="divide-y divide-foreground/10">
        {items.map((item) => (
          <li
            key={`${item.productId}-${item.variantId}`}
            className="flex gap-4 py-6"
          >
            <div className="h-24 w-24 shrink-0 overflow-hidden bg-surface">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  width={200}
                  height={200}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <p className="text-sm">{item.title}</p>
                <p className="text-xs text-foreground/60">{item.variantTitle}</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(
                      item.productId,
                      item.variantId,
                      Number(e.target.value)
                    )
                  }
                  className="w-16 border border-foreground/20 bg-transparent px-2 py-1 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeItem(item.productId, item.variantId)}
                  className="text-xs text-foreground/60 underline"
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="text-sm">{formatPrice(item.price * item.quantity)}</p>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between border-t border-foreground/10 pt-6">
        <span className="text-sm tracking-wide uppercase">Subtotal</span>
        <span className="text-sm">{formatPrice(subtotal)}</span>
      </div>

      {error ? <p className="mt-4 text-sm text-accent">{error}</p> : null}

      <button
        type="button"
        disabled={loading}
        onClick={checkout}
        className="mt-6 w-full bg-accent px-5 py-3 text-sm tracking-wide text-surface uppercase transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {loading ? "Redirecting…" : "Checkout"}
      </button>
    </main>
  );
}
