import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Printify mockup URLs rarely change, so cache optimized images for 31 days
    // instead of the 4-hour default to avoid re-transforming on expiry.
    minimumCacheTTL: 2678400,
    // Fewer candidate widths means fewer unique transformations per image.
    deviceSizes: [640, 1080, 1920],
    imageSizes: [128, 256],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images-api.printify.com",
      },
    ],
  },
};

export default nextConfig;
