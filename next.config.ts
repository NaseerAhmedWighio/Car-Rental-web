import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    domains: ['cdn.sanity.io','img.clerk.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;