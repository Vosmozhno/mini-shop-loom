/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'd2f0713c-medusa-store-images.s3.twcstorage.ru',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
