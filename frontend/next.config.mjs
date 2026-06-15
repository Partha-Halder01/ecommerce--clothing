/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  // Smaller client bundles by tree-shaking heavy icon/animation libs
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  // Allow ngrok tunnels to pass host validation
  allowedDevOrigins: ['*.ngrok-free.app', '*.ngrok.io'],
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // cache optimized images for 7 days
    // Product/category images can be hosted anywhere (admins paste external URLs),
    // so allow any HTTPS host. Optimization + caching still apply.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig
