import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "San Rancho — minimalist tees, printed on demand.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-6 py-16">
      <h1 className="mb-8 text-lg tracking-wide uppercase">About</h1>
      <div className="flex flex-col gap-4 mb-8 text-sm leading-relaxed text-foreground/70">
        <p>San Rancho makes irreverent tees commemorating camps, cults and other exclusive communities. Any similarity to actual persons, living or dead, or fictional events or organizations is purely coincidental.</p>
        <p>
          Every shirt is printed on demand after you order, so nothing is made until it has a home. Orders ship to the United States and Canada.
        </p>
      </div>
      <h2 className="mb-4 text-lg tracking-wide uppercase">Disclaimers and Apologies</h2>
      <div className="flex flex-col gap-4 text-sm leading-relaxed text-foreground/70">
        <h3 className="text-lg">Quality</h3>
        <p>Production is outsourced through Printify. No product is added to the store that hasn&apos;t been sampled in at least one color combination, though not every color combination has been sampled. That said, for now, prints are DTG (Direct-to-Garment). Because each item is designed using vector art and typically in single color, the quality of DTG prints is quite comparable to traditional screen-print.</p>
        <h3 className="text-lg">Company Tactics</h3>
        <p>San Rancho does not collect or sell your personal information because we&apos;re not losers. You will not come across pop-ups with passive-aggressive text on the close button. We do not post to social media or blast emails. Simply put, we&apos;re not making money.</p>
        <h3 className="text-lg">We&apos;re Sorry</h3>
        <p>Relying on 3rd-party printers is not ideal, but it is the only way for now. Shipping fees are beyond the control of San Rancho. Maybe someday we can scale and move production in-house, but for now we appreciate your understanding. Because large orders may be divided among multiple print shops, shipping can add up quickly, and for that we apologize.</p>
      </div>

    </main>
  );
}
