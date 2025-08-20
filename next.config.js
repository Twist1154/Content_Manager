/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ukmmiaupsbmzgseheyky.supabase.co', // Your Supabase project hostname
        port: '',
        pathname: '/storage/v1/object/public/**', // Allow all images from public storage buckets
      },
    ],
  },
};

module.exports = nextConfig;
