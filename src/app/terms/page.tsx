import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of sale, returns and use for San Rancho.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-6 py-16">
      <h1 className="mb-2 text-lg tracking-wide uppercase">Terms</h1>
      <p className="mb-8 text-xs text-foreground/50">Last updated October 9, 2026</p>
      <div className="flex flex-col gap-8 text-sm leading-relaxed text-foreground/70">
        <p>
          These terms apply when you use sanrancho.com or buy something from
          San Rancho. By placing an order you agree to them.
        </p>

        <section className="flex flex-col gap-2">
          <h2 className="text-xs tracking-wide text-foreground uppercase">
            Orders and pricing
          </h2>
          <p>
            Prices are in US dollars. Sales tax is added at checkout where
            required, and any shipping cost is shown before you pay. We may
            cancel and fully refund an order if a product is listed at the wrong
            price or becomes unavailable.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xs tracking-wide text-foreground uppercase">
            Made to order
          </h2>
          <p>
            Everything is printed on demand by our production partner, Printify,
            after you order. Production usually takes a few business days before
            your order ships. Orders with several items may arrive in separate
            packages. Colors can vary slightly from what you see on screen.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xs tracking-wide text-foreground uppercase">
            Cancellations
          </h2>
          <p>
            Need to cancel or change something? Email us as soon as possible.
            Once an order has gone into production we can&apos;t cancel it.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xs tracking-wide text-foreground uppercase">
            Returns and refunds
          </h2>
          <p>
            Because each item is made just for you, we can&apos;t accept returns
            for change of mind or wrong size, so please check the size chart
            before ordering. If your item arrives misprinted, damaged or
            different from what you ordered, email us within 30 days of delivery
            with your order details and a photo, and we&apos;ll send a
            replacement or a full refund.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xs tracking-wide text-foreground uppercase">
            Shipping problems
          </h2>
          <p>
            Please double-check your shipping address at checkout; we
            can&apos;t cover orders sent to an incorrect address. If tracking
            shows your package lost in transit, email us and we&apos;ll work
            with you to make it right.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xs tracking-wide text-foreground uppercase">
            Satire
          </h2>
          <p>
            San Rancho designs are parody and commentary. San Rancho is not
            affiliated with, sponsored by or endorsed by any person, group or
            organization a design may reference.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xs tracking-wide text-foreground uppercase">
            Our designs
          </h2>
          <p>
            The designs, text and images on this site belong to San Rancho.
            Please don&apos;t copy or resell them.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xs tracking-wide text-foreground uppercase">
            Liability
          </h2>
          <p>
            The site and products are provided as is. To the extent the law
            allows, San Rancho&apos;s liability for any claim related to an
            order is limited to the amount you paid for that order.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xs tracking-wide text-foreground uppercase">
            Governing law and changes
          </h2>
          <p>
            These terms are governed by the laws of the State of Missouri. We
            may update them from time to time; the version posted when you place
            an order applies to that order.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xs tracking-wide text-foreground uppercase">
            Contact
          </h2>
          <p>
            Questions or problems with an order? Email{" "}
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
