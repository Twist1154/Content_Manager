/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ukmmiaupsbmzgseheyky.supabase.co',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
