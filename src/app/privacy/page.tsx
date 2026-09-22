import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How San Rancho handles your information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-6 py-16">
      <h1 className="mb-8 text-lg tracking-wide uppercase">Privacy</h1>
      <div className="flex flex-col gap-8 text-sm leading-relaxed text-foreground/70">
        <section className="flex flex-col gap-2">
          <h2 className="text-xs tracking-wide text-foreground uppercase">
            What we collect
          </h2>
          <p>
            When you place an order we collect your name, email address,
            shipping address, phone number and payment details. We don&apos;t
            have accounts, and we never see or store your full card number —
            payment is handled by Stripe.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xs tracking-wide text-foreground uppercase">
            How we use it
          </h2>
          <p>
            Only to take payment, print and ship your order, and email you about
            it. We don&apos;t sell your information or use it for marketing.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xs tracking-wide text-foreground uppercase">
            Who we share it with
          </h2>
          <ul className="flex list-disc flex-col gap-1 pl-5">
            <li>
              <strong className="font-medium text-foreground">Stripe</strong>{" "}
              processes payments.
            </li>
            <li>
              <strong className="font-medium text-foreground">Printify</strong>{" "}
              and its print providers receive your name, shipping address, email
              and phone number to produce and ship your order.
            </li>
            <li>
              <strong className="font-medium text-foreground">Vercel</strong>{" "}
              hosts this site and provides anonymous, cookie-free analytics on
              page visits.
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xs tracking-wide text-foreground uppercase">
            Your cart
          </h2>
          <p>
            Your cart is saved in your browser&apos;s local storage so it
            survives a page reload. It never leaves your device until you check
            out, and you can clear it at any time from your browser settings.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xs tracking-wide text-foreground uppercase">
            Contact
          </h2>
          <p>
            Questions? Email{" "}
            <a
              href="mailto:sup@sanrancho.com"
              className="text-foreground underline"
            >
              sup@sanrancho.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
