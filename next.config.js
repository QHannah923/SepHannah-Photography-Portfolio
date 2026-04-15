/** @type {import('next').NextConfig} */
// `next dev` loads this file with argv[2] === 'dev'. Skipping the image optimizer avoids
// dev getting stuck on “Compiling” when processing large local JPGs.
const isDevServer = process.argv[2] === 'dev';

const nextConfig = {
  images: {
    unoptimized: isDevServer,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.us-west-2.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
