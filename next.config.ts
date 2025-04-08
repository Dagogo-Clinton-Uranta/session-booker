import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
  eslint: {
    ignoreDuringBuilds: true, // ⚠️ Disables blocking deploys on lint errors
  },
};



export default nextConfig;
