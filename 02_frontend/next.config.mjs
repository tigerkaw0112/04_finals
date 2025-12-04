/** @type {import('next').NextConfig} */
const API_HOST = process.env.API_HOST || 'http://localhost:3001';

const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_HOST: API_HOST,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'www.melivecode.com' } // เผื่อไว้
    ],
  },
};

export default nextConfig;