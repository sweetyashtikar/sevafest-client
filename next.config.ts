import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["res.cloudinary.com", "via.placeholder.com"],
  }, compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
