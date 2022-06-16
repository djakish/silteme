/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["nnxkhppnqvfelyhkkkgq.supabase.co", "localhost"],
  },
  swcMinify: true,
};

module.exports = nextConfig;
