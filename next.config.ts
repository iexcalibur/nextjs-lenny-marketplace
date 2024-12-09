import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },
  images: {
    domains: [
      'fansarmy.in',
      'm.media-amazon.com',
      'media-amazon.com',
      'images-na.ssl-images-amazon.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.amazon.com',
        pathname: '/**',
      }
    ]
  },
};

export default nextConfig;
