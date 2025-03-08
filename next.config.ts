import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["source.unsplash.com", "asset.cloudinary.com", "res.cloudinary.com"],
    disableStaticImages: true,
  },
};

export default nextConfig;
