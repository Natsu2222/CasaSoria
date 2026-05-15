import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)
import { redirects } from './redirects'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

// Hosts that next/image is allowed to fetch from. We always include the app's
// own server, plus — if configured — the public R2 URL where uploaded media
// lives. Without this, next/image silently rejects bucket URLs and the
// frontend renders broken images.
const ALLOWED_IMAGE_ORIGINS = [
  NEXT_PUBLIC_SERVER_URL,
  process.env.S3_PUBLIC_URL,
].filter((value): value is string => typeof value === 'string' && value.length > 0)

const nextConfig: NextConfig = {
  // Required for the Dockerfile in this repo: produces .next/standalone with
  // a self-contained server.js. Vercel ignores this flag, so it's safe to leave on.
  output: 'standalone',
  poweredByHeader: false,
  // Temporarily required on Windows until Next.js fixes Turbopack Sass resolution.
  // See: https://github.com/vercel/next.js/issues/86431
  sassOptions: {
    loadPaths: ['./node_modules/@payloadcms/ui/dist/scss/'],
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
    // Allow the Next/Image quality prop to fall back to 75 (default) or 85;
    // 100 alone forces every image to be served at max quality.
    qualities: [75, 85, 100],
    remotePatterns: ALLOWED_IMAGE_ORIGINS.map((item) => {
      const url = new URL(item)

      return {
        hostname: url.hostname,
        protocol: url.protocol.replace(':', '') as 'http' | 'https',
      }
    }),
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
