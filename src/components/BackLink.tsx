"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

// Goes back in history when the previous page is on this site (so scroll
// position is restored), otherwise links to `fallbackHref`.
export function BackLink({ fallbackHref = "/" }: { fallbackHref?: string }) {
  const router = useRouter();

  return (
    <Link
      href={fallbackHref}
      onClick={(e) => {
        // The Navigation API only lists same-origin entries, so index > 0
        // means the previous page is ours.
        const nav = (window as { navigation?: { currentEntry?: { index: number } } })
          .navigation;
        if ((nav?.currentEntry?.index ?? 0) > 0) {
          e.preventDefault();
          router.back();
        }
      }}
      className="text-xs tracking-wide text-foreground/60 uppercase hover:text-foreground"
    >
      ← Back
    </Link>
  );
}
