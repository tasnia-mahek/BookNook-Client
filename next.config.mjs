/** @type {import('next').NextConfig} */
const nextConfig = { images: { remotePatterns: [
  { protocol: 'https', hostname: 'i.ibb.co', pathname: '/**' },
  { protocol: 'https', hostname: 'i.ibb.co.com', pathname: '/**' },
  { protocol: 'https', hostname: 'ibb.co', pathname: '/**' },
  { protocol: 'https', hostname: 'ibb.co.com', pathname: '/**' },
  { protocol: 'https', hostname: 'image.ibb.co', pathname: '/**' },
  { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
  { protocol: 'https', hostname: 'plus.unsplash.com', pathname: '/**' },
  { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
] } };
export default nextConfig;
