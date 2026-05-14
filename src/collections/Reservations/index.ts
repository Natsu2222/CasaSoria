import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'

// ─────────────────────────────────────────────────────────────────────────────
// Anti-spam configuration for the public POST /api/reservations endpoint.
//
// The Reservations collection is intentionally open to anonymous create so the
// product page form works without auth, but that means the endpoint is exposed
// to bots. The hook below adds three cheap layers of defense:
//
//   1. Honeypot — a hidden `website` field that real users never fill in. Bots
//      that scrape forms tend to fill every input. If it's set, we reject.
//   2. Phone-number sanity — strip everything except digits and a leading '+',
//      then require 7–15 digits (ITU-T E.164 max is 15).
//   3. Rate limit — count recent reservations from the same email OR the same
//      IP within a sliding window and reject if it exceeds the threshold.
//
// These do NOT replace Cloudflare Turnstile / hCaptcha in front of the form
// for high-traffic stores, but they cover the obvious abuse for free.
// ─────────────────────────────────────────────────────────────────────────────

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const RATE_LIMIT_MAX_PER_EMAIL = 3
const RATE_LIMIT_MAX_PER_IP = 8

const getClientIP = (headers: Headers | undefined): string | null => {
  if (!headers) return null
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim()
  return headers.get('x-real-ip') || headers.get('cf-connecting-ip') || null
}

const normalizePhone = (raw: string): string => {
  const trimmed = raw.trim()
  // Keep one leading '+' if present, drop everything else non-digit.
  const hasPlus = trimmed.startsWith('+')
  const digits = trimmed.replace(/\D+/g, '')
  return hasPlus ? `+${digits}` : digits
}

const beforeValidateGuard: CollectionBeforeValidateHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create') return data

  const incoming = (data ?? {}) as Record<string, unknown>

  // Note: we intentionally DO NOT short-circuit on req.user. The product page
  // submits to /api/reservations with the visitor's cookies, so when an admin
  // is also logged into /admin in the same browser, req.user is populated and
  // any "skip for logged-in users" guard would silently disable the rate
  // limit. Admins virtually never create reservations through this endpoint
  // anyway; if they need to, 3 in 10 minutes is plenty.

  // 1. Honeypot check. The `hp_field` is rendered hidden on the form; only
  //    bots fill it in. We deliberately avoid common names ("website", "url",
  //    "company") because Chrome/Safari autofill them, which trips the trap
  //    for real users. Throw a generic error so we don't tell the bot why
  //    we rejected it.
  const honeypot = typeof incoming.hp_field === 'string' ? incoming.hp_field.trim() : ''
  if (honeypot.length > 0) {
    req.payload.logger.warn(
      { ip: getClientIP(req.headers), email: incoming.email },
      'Reservation rejected: honeypot tripped',
    )
    throw new Error('Invalid submission')
  }

  // 2. Phone normalization + length sanity check.
  if (typeof incoming.mobile === 'string') {
    const normalized = normalizePhone(incoming.mobile)
    const digitCount = normalized.replace(/\D+/g, '').length
    if (digitCount < 7 || digitCount > 15) {
      throw new Error('Please provide a valid mobile number')
    }
    incoming.mobile = normalized
  }

  // 3. Rate limit by email + IP over the last RATE_LIMIT_WINDOW_MS.
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString()
  const ip = getClientIP(req.headers)

  req.payload.logger.info(
    { ip, email: incoming.email, since },
    'Reservation rate-limit check starting',
  )

  if (typeof incoming.email === 'string' && incoming.email) {
    const recentByEmail = await req.payload.count({
      collection: 'reservations',
      where: {
        and: [
          { email: { equals: incoming.email.toLowerCase() } },
          { createdAt: { greater_than: since } },
        ],
      },
      overrideAccess: true,
    })
    if (recentByEmail.totalDocs >= RATE_LIMIT_MAX_PER_EMAIL) {
      req.payload.logger.warn(
        { email: incoming.email, ip },
        'Reservation rate-limited by email',
      )
      throw new Error('Too many recent reservations from this email. Please try again later.')
    }
    incoming.email = incoming.email.toLowerCase()
  }

  if (ip) {
    const recentByIP = await req.payload.count({
      collection: 'reservations',
      where: {
        and: [
          { submittedFromIP: { equals: ip } },
          { createdAt: { greater_than: since } },
        ],
      },
      overrideAccess: true,
    })
    if (recentByIP.totalDocs >= RATE_LIMIT_MAX_PER_IP) {
      req.payload.logger.warn({ ip }, 'Reservation rate-limited by IP')
      throw new Error('Too many recent reservations from this network. Please try again later.')
    }
    incoming.submittedFromIP = ip
  }

  return incoming
}

export const Reservations: CollectionConfig = {
  slug: 'reservations',
  access: {
    create: anyone,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['product', 'status', 'fullName', 'mobile', 'email', 'createdAt'],
    useAsTitle: 'fullName',
  },
  hooks: {
    beforeValidate: [beforeValidateGuard],
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      index: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      index: true,
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Ready for pickup', value: 'ready' },
        { label: 'Collected / Paid in store', value: 'collected' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'fullName',
      type: 'text',
      required: true,
      label: 'Full name',
      maxLength: 120,
    },
    {
      name: 'mobile',
      type: 'text',
      required: true,
      label: 'Mobile number',
      validate: (value: unknown) => {
        if (typeof value !== 'string') return 'Mobile number is required'
        const digits = value.replace(/\D+/g, '')
        if (digits.length < 7) return 'Mobile number looks too short'
        if (digits.length > 15) return 'Mobile number looks too long'
        return true
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email',
      index: true,
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Message (optional)',
      maxLength: 1000,
    },
    // Hidden honeypot field. The public form renders it as an off-screen input
    // and humans never see it; bots tend to fill every visible-looking field.
    // NOTE: avoid common names like "website", "url" or "company" — browsers
    // autofill those and trip the trap for real users.
    {
      name: 'hp_field',
      type: 'text',
      label: 'Leave this field empty',
      admin: {
        hidden: true,
      },
    },
    // Captured server-side from request headers. Useful for moderation and
    // for the rate-limit hook above. Read-only in the admin UI.
    {
      name: 'submittedFromIP',
      type: 'text',
      label: 'Submitted from IP',
      index: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
