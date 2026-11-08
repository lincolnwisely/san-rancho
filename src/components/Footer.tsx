import Image from "next/image";
import Link from "next/link";

// Only list methods enabled in Stripe (Settings → Payment methods).
const PAYMENT_METHODS = [
  { name: "Visa", src: "/payment-icons/Visa.jpg" },
  { name: "Mastercard", src: "/payment-icons/Mastercard.jpg" },
  { name: "American Express", src: "/payment-icons/Amex.jpg" },
  { name: "Apple Pay", src: "/payment-icons/ApplePay.jpg" },
  { name: "Google Pay", src: "/payment-icons/GooglePay.jpg" },
];

export function Footer() {
  return (
    <footer className="border-t border-foreground/10">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 font-mono text-xs tracking-wide text-foreground/60 uppercase sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} San Rancho</p>
        <nav className="flex gap-6">
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>
        <a
          href="https://instagram.com/shopsanrancho"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          @shopsanrancho
        </a>
      </div>
      <ul
        aria-label="Payment methods"
        className="mx-auto flex max-w-5xl flex-wrap gap-2 px-6 pb-8"
      >
        {PAYMENT_METHODS.map((m) => (
          <li key={m.name}>
            {/* Icons are 356×240, shown at 2x. */}
            <Image
              src={m.src}
              alt={m.name}
              width={36}
              height={24}
              className="h-6 w-9 rounded-[3px] border border-foreground/15"
            />
          </li>
        ))}
      </ul>
    </footer>
  );
}
