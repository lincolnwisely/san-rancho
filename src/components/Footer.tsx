import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-foreground/10">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 text-xs tracking-wide text-foreground/60 uppercase sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} San Rancho</p>
        <nav className="flex gap-6">
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
      </div>
    </footer>
  );
}
