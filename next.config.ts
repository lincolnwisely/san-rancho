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
};

export default nextConfig;
