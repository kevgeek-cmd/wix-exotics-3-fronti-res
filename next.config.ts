import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.wixstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.wixstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    // Default fallback to the provided free Wix URL if env var is missing
    const wixBackendUrl = process.env.WIX_BACKEND_URL || "https://valeriecoulibaly7.wixsite.com/exotic-3-frontieres";
    
    return [
      {
        source: '/_api/:path*',
        destination: `${wixBackendUrl}/_api/:path*`,
      },
    ];
  },
};

export default nextConfig;
