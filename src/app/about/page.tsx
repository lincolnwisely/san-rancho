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
      <div className="flex flex-col gap-4 text-sm leading-relaxed text-foreground/70">
        <p>San Rancho makes irreverent tees commemorating camps, cults and other exclusive communities.</p>
        <p>Any similarity to actual persons, living or dead, or fictional events or organizations is purely coincidental.</p>

        <p>
          Every shirt is printed on demand after you order, so nothing is made
          until it has a home. Orders ship to the United States and Canada.
        </p>
      </div>
    </main>
  );
}
