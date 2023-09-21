/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uaeuresources.blob.core.windows.net',
        port: '',
        pathname: '/attachments/*',
      }
    ],
  },
}

module.exports = nextConfig
