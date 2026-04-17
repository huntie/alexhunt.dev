import { execSync } from 'node:child_process';

function getCommitHash() {
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7);
  }
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'unknown';
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_COMMIT_HASH: getCommitHash(),
  },
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
