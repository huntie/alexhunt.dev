/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // TODO: Add more patterns / configure local caching
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'reactnative.dev',
      },
    ],
  },
};

export default nextConfig;
