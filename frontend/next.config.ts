import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "uyfgvyysqobnytfromif.supabase.co", // supabase storage 도메인 추가
    ],
  },
};

export default nextConfig;
