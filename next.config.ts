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
    // URL de fallback si la variable d'environnement n'est pas définie
    const defaultWixUrl = "https://valeriecoulibaly7.wixsite.com/exotic-3-frontieres";
    const wixBackendUrl = process.env.WIX_BACKEND_URL || defaultWixUrl;

    if (!wixBackendUrl) return [];
    
    return [
      {
        source: '/_api/:path*',
        destination: `${wixBackendUrl}/_api/:path*`,
      },
    ];
  },
};

export default nextConfig;
