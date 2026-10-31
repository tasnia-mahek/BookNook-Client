/** @type {import('next').NextConfig} */
const nextConfig = { images: { remotePatterns: [
  { protocol: 'https', hostname: 'i.ibb.co' },
  { protocol: 'https', hostname: 'image.ibb.co' },
  { protocol: 'https', hostname: 'images.unsplash.com' },
  { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
  { protocol: 'https', hostname: 'plus.unsplash.com' },
] } };
export default nextConfig;
