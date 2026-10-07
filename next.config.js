
/** @type {import('next').NextConfig} */
/* const withPWA = require("@ducanh2912/next-pwa").default({
    dest: "public",
    cacheOnFrontEndNav: false,
    aggressiveFrontEndNavCaching: false,
    reloadOnOnline: true,
    swcMinify: true,
    disable: false,
    workboxOptions:{
        disableDevLogs: false
    }
  });


const nextConfig = {
  //output: 'export',
};


module.exports = withPWA(nextConfig); */
module.exports = {
  reactStrictMode: false,
  output: 'standalone',
  async rewrites() {
    const apiServerUrl = process.env.API_SERVER_URL || 'http://localhost:8080'

    return [
      {
        source: '/tiles/:path*',
        destination: `${apiServerUrl}/tile/:path*`,
      },
      {
        source: '/api/geo/:path*',
        destination: `${apiServerUrl}/api/geo/:path*`,
      },
      {
        source: '/ws/:path*',
        destination: `${apiServerUrl}/ws/:path*`,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ]
  },
}