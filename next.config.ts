import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl =
      process.env.BACKEND_PROXY_URL ||
      'https://zygomorphic-emelda-hydrolink-c0bef3b5.koyeb.app/api/v1';
    return [
      {
        source: '/api-proxy/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
