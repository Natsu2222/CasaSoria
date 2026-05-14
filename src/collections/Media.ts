import type { CollectionAfterReadHook, CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

// Strip a trailing slash if the user added one in .env, so we always
// concatenate `${PUBLIC_URL}/${filename}` cleanly.
const PUBLIC_URL = (process.env.S3_PUBLIC_URL ?? '').replace(/\/$/, '')

/**
 * Rewrite the `url` of each media doc (and its resized sizes) to point at the
 * public R2 URL instead of the default `/api/media/file/[filename]` route.
 *
 * Why we do this:
 *   - By default Payload proxies file reads through its own API, which means
 *     every <img> request goes through Next.js. That's slow and burns server
 *     resources.
 *   - R2 already exposes the bucket publicly via S3_PUBLIC_URL (the r2.dev
 *     URL today, a custom domain tomorrow). Serving images straight from
 *     Cloudflare's CDN is faster and cheaper.
 *
 * Doing it in an afterRead hook (instead of beforeChange) means the URL is
 * computed dynamically — switch S3_PUBLIC_URL to your custom domain and the
 * change applies immediately without a data migration.
 */
const rewriteMediaURLs: CollectionAfterReadHook = ({ doc }) => {
  if (!PUBLIC_URL || !doc) return doc

  if (typeof doc.filename === 'string' && doc.filename.length > 0) {
    doc.url = `${PUBLIC_URL}/${doc.filename}`
  }

  if (doc.sizes && typeof doc.sizes === 'object') {
    for (const size of Object.values(doc.sizes as Record<string, unknown>)) {
      if (
        size &&
        typeof size === 'object' &&
        'filename' in size &&
        typeof (size as { filename?: unknown }).filename === 'string'
      ) {
        const filename = (size as { filename: string }).filename
        if (filename.length > 0) {
          ;(size as { url?: string }).url = `${PUBLIC_URL}/${filename}`
        }
      }
    }
  }

  return doc
}

export const Media: CollectionConfig = {
  slug: 'media',
  folders: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterRead: [rewriteMediaURLs],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      //required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    // No staticDir — files live in R2. The s3Storage adapter in
    // src/plugins/index.ts intercepts uploads with `disableLocalStorage: true`
    // and writes them straight to the bucket.
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    // Serve resized images as WebP for ~30% smaller payloads, with a small
    // quality bump so they don't look soft.
    formatOptions: {
      format: 'webp',
      options: { quality: 82 },
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
}
