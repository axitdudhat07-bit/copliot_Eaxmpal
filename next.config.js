/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  experimental: {
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
    ],
  },
}

module.exports = nextConfig
