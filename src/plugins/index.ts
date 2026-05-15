import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { s3Storage } from '@payloadcms/storage-s3'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'

import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payload Website Template` : 'Payload Website Template'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

// ─────────────────────────────────────────────────────────────────────────────
// Cloudflare R2 (S3-compatible) storage adapter for the `media` collection.
//
// What this does:
//   - Intercepts uploads to the `media` collection and writes them to R2.
//   - Sets `disableLocalStorage` so files no longer end up in public/media.
//   - The bucket and credentials come from .env (S3_BUCKET, S3_ENDPOINT,
//     S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY). See .env.example.
//
// The `url` field on each Media doc is rewritten to point at the public R2
// URL (S3_PUBLIC_URL) by an `afterRead` hook in src/collections/Media.ts.
// We do it there instead of here so it also covers the resized image sizes.
//
// To switch to a custom domain later (recommended for production), just
// change S3_PUBLIC_URL in your environment — no code change required.
// ─────────────────────────────────────────────────────────────────────────────

// TEMP DEBUG — log what the runtime actually sees. Remove this block once
// uploads work end-to-end.
//
// We print:
//   - String lengths for the credentials (R2 access key is 32 chars, secret is 64)
//   - First & last 4 chars of each credential so we can spot accidental swaps
//     or copy-paste truncation without exposing the full secret in logs.
const len = (v: string | undefined) => (typeof v === 'string' ? v.length : 0)
const head = (v: string | undefined) => (typeof v === 'string' ? v.slice(0, 4) : '')
const tail = (v: string | undefined) => (typeof v === 'string' ? v.slice(-4) : '')

const R2_ENV_DUMP = {
  S3_BUCKET: JSON.stringify(process.env.S3_BUCKET),
  S3_ENDPOINT: JSON.stringify(process.env.S3_ENDPOINT),
  S3_REGION: JSON.stringify(process.env.S3_REGION),
  S3_ACCESS_KEY_ID_len: len(process.env.S3_ACCESS_KEY_ID),
  S3_ACCESS_KEY_ID_preview: `${head(process.env.S3_ACCESS_KEY_ID)}...${tail(process.env.S3_ACCESS_KEY_ID)}`,
  S3_SECRET_ACCESS_KEY_len: len(process.env.S3_SECRET_ACCESS_KEY),
  S3_SECRET_ACCESS_KEY_preview: `${head(process.env.S3_SECRET_ACCESS_KEY)}...${tail(process.env.S3_SECRET_ACCESS_KEY)}`,
  S3_PUBLIC_URL: JSON.stringify(process.env.S3_PUBLIC_URL),
  // Detect if anything else in the env is shadowing AWS creds (some Vercel
  // integrations set AWS_* vars which the SDK auto-picks up).
  has_AWS_ACCESS_KEY_ID: !!process.env.AWS_ACCESS_KEY_ID,
  has_AWS_SECRET_ACCESS_KEY: !!process.env.AWS_SECRET_ACCESS_KEY,
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_ENV: process.env.VERCEL_ENV,
}
console.log('[R2_BOOT_CHECK]', R2_ENV_DUMP)

const r2Bucket = (process.env.S3_BUCKET ?? '').trim()
const r2Endpoint = (process.env.S3_ENDPOINT ?? '').trim()
const r2AccessKey = (process.env.S3_ACCESS_KEY_ID ?? '').trim()
const r2SecretKey = (process.env.S3_SECRET_ACCESS_KEY ?? '').trim()

if (!r2Bucket || !r2Endpoint || !r2AccessKey || !r2SecretKey) {
  // Fail loudly instead of silently passing empty values to the S3 SDK, which
  // would later throw the cryptic "No value provided for input HTTP label:
  // Bucket." error at upload time.
  throw new Error(
    `[R2 storage] Missing required environment variables. ` +
      `Seen at boot: ${JSON.stringify(R2_ENV_DUMP)}. ` +
      `Make sure S3_BUCKET, S3_ENDPOINT, S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY are set ` +
      `and NOT marked as "Sensitive" in Vercel — sensitive vars are not available during build.`,
  )
}

const r2Storage = s3Storage({
  collections: {
    media: {
      disableLocalStorage: true,
    },
  },
  bucket: r2Bucket,
  config: {
    endpoint: r2Endpoint,
    region: process.env.S3_REGION || 'auto',
    credentials: {
      accessKeyId: r2AccessKey,
      secretAccessKey: r2SecretKey,
    },
    // Required for R2/MinIO — without this the SDK builds vhost-style URLs
    // like https://<bucket>.<endpoint>/key which R2 rejects.
    forcePathStyle: true,
  },
})

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  r2Storage,
]
