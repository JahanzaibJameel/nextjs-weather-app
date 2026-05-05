/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'openweathermap.org',
        pathname: '/img/wn/**',
      },
    ],
    formats: {
      image: {
        avif: {
          quality: 80,
        },
        webp: {
          quality: 80,
        },
      },
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }
    return config;
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: true,
  },
  poweredByHeader: false,
  compress: true,
};

module.exports = nextConfig;