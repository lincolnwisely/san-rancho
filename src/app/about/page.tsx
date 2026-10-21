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
        <p>Strongly inspired by various religious cults of the United States, San Rancho makes irreverent hoodies, crew-neck sweatshirts, t-shirts and accessories commemorating camps, cults and other members-only communities.</p>
        <p>Any similarity to actual persons, living or dead, or events or organizations, real or fictional, is mostly coincidental.</p>
        <p>Every shirt is printed on demand after you order, so nothing is made until it has a home. Due to the small scale of San Rancho, we can only fulfill orders to the United States at this time. Thank you for understanding.</p>
      </div>
      <div className="flex flex-col gap-4 text-sm leading-relaxed text-foreground/70">
        <h3 className="text-lg">Quality</h3>
        <p>Production is outsourced through Printify. Most, but not all, products have been sampled because we also want to wear the stuff we sell and feel good about the product. Because each item is designed using vector art and typically in single color, the quality of DTG prints is quite comparable to traditional screen-print. If you have any issues with quality, please let us know at sup@sanrancho.com. </p>
      </div>
    </main>
  );
}
