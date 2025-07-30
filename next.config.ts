import type { NextConfig } from "next";

const nextConfig = {
  // ... any other configurations you have
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // This block tells Next.js to ignore ESLint errors during the build
  eslint: {
    ignoreDuringBuilds: true,
  },
};
export default nextConfig;
