"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import logo from "@/app/img/san-rancho_horizontal.svg";

export function Header() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          <Image src={logo} alt="San Rancho" className="h-16 w-auto" priority />
        </Link>
        <Link
          href="/cart"
          className="flex items-center gap-2 text-sm tracking-wide uppercase"
        >
          Cart
          {count > 0 ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-pop-1 px-1.5 text-xs font-medium text-foreground normal-case">
              {count}
            </span>
          ) : null}
        </Link>
      </div>
    </header>
  );
}
