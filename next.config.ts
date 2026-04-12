import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
    // Use unoptimized for Google Drive images to avoid Vercel image optimization quota
    unoptimized: true,
  },
};

export default nextConfig;
