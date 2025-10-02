/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',       // required for static export
  trailingSlash: true,    // optional, ensures URLs end with '/'
   images: {
    unoptimized: true, // ⚡ disable image optimization for static export
  },
};


export default nextConfig;
