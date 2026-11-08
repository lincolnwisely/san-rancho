import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Printify mockups are already small JPGs (~40–90 KB), so serve them as-is
    // and skip Vercel Image Optimization (Hobby plan caps transformations).
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images-api.printify.com",
      },
    ],
  },
  // Short link for the Instagram bio, so visits are tagged without the UTM
  // showing in the link text. Not permanent, so it can be re-pointed later.
  async redirects() {
    return [
      {
        source: "/ig",
        destination: "/?utm_source=instagram&utm_medium=social",
        permanent: false,
      },
      {
        source: "/gh",
        destination: "/?utm_source=github&utm_medium=social",
        permanent: false,
      },
      {
        source: "/px",
        destination: "/?utm_source=plex&utm_medium=social",
        permanent: false,
      },
      {
        source: "/tk",
        destination: "/?utm_source=tiktok&utm_medium=social",
        permanent: false,
      },
      {
        source: "/r",
        destination: "/?utm_source=reddit&utm_medium=social",
        permanent: false,
      },
    ];
  },
  // images-api.printify.com's robots.txt blocks Google, so the Merchant Center
  // feed points images at this path on our own domain instead.
  async rewrites() {
    return [
      {
        source: "/printify-images/:path*",
        destination: "https://images-api.printify.com/:path*",
      },
    ];
  },
};

export default nextConfig;
