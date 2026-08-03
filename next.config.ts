import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2560],
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
};

export default nextConfig;
