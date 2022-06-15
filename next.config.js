/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["elhwmvlgafwmydwmaumb.supabase.co", "localhost"],
  },
  swcMinify: true,
};

module.exports = nextConfig;
