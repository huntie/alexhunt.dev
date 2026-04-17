/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wsmzc5b5nfvsy8nj.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
