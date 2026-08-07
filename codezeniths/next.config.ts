// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Needed so Three.js/R3F don't get SSR'd
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],

  // Turbopack options replacing custom Webpack configurations
  turbopack: {
    // Custom Turbopack options (like resolveAlias, resolveExtensions, rules) can be declared here
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
};

export default nextConfig;