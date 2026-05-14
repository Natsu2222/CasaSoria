import React from 'react'

// We define props locally instead of importing from `@/payload-types` so the
// component compiles cleanly the first time you pull this code, before
// Payload has had a chance to regenerate types. After your next `pnpm dev`
// run there will be a generated `LocationBlock` interface — you can swap to
// it if you prefer a single source of truth.
type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'

type OpeningHour = {
  daysOfWeek?: DayOfWeek[] | null
  opens?: string | null
  closes?: string | null
  closed?: boolean | null
  id?: string | null
}

type LocationBlockProps = {
  businessName: string
  description?: string | null
  address: {
    streetAddress: string
    postalCode: string
    addressLocality: string
    addressRegion?: string | null
    addressCountry: string
  }
  phone: string
  email?: string | null
  embedUrl: string
  geo?: {
    latitude?: number | null
    longitude?: number | null
  } | null
  openingHours?: OpeningHour[] | null
  priceRange?: string | null
  blockType?: 'locationBlock'
  blockName?: string | null
  id?: string | null
  disableInnerContainer?: boolean
}

// Map of schema.org day names → short labels for the UI. Keeping schema.org
// values as the source of truth simplifies the JSON-LD payload.
const DAY_LABELS: Record<DayOfWeek, string> = {
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
  Saturday: 'Sat',
  Sunday: 'Sun',
}

export const LocationBlock: React.FC<LocationBlockProps> = (props) => {
  const {
    businessName,
    description,
    address,
    phone,
    email,
    embedUrl,
    geo,
    openingHours,
    priceRange,
  } = props

  // Defense in depth: even though the field-level validator restricts this,
  // refuse to render an iframe pointing anywhere other than Google Maps embed.
  const safeEmbedUrl =
    typeof embedUrl === 'string' && embedUrl.startsWith('https://www.google.com/maps/embed')
      ? embedUrl
      : null

  const jsonLd = buildLocalBusinessJsonLd({
    businessName,
    description,
    address,
    phone,
    email,
    geo,
    openingHours,
    priceRange,
  })

  return (
    <section className="container" aria-labelledby="location-heading">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
        <div className="flex flex-col">
          <h2 id="location-heading" className="text-3xl font-semibold tracking-tight mb-2">
            {businessName}
          </h2>

          {description ? (
            <p className="text-muted-foreground mb-6">{description}</p>
          ) : null}

          <address className="not-italic space-y-4 text-base">
            <div>
              <div className="font-medium mb-1">Address</div>
              <div>{address?.streetAddress}</div>
              <div>
                {[address?.postalCode, address?.addressLocality].filter(Boolean).join(' ')}
                {address?.addressRegion ? `, ${address.addressRegion}` : ''}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:gap-8 gap-4">
              {phone ? (
                <div>
                  <div className="font-medium mb-1">Phone</div>
                  <a className="hover:underline" href={`tel:${phone.replace(/\s+/g, '')}`}>
                    {phone}
                  </a>
                </div>
              ) : null}

              {email ? (
                <div>
                  <div className="font-medium mb-1">Email</div>
                  <a className="hover:underline break-all" href={`mailto:${email}`}>
                    {email}
                  </a>
                </div>
              ) : null}
            </div>

            {Array.isArray(openingHours) && openingHours.length > 0 ? (
              <div>
                <div className="font-medium mb-1">Opening hours</div>
                <ul className="space-y-1">
                  {openingHours.map((entry, i) => (
                    <li key={i} className="text-sm">
                      <span className="font-medium">{formatDays(entry.daysOfWeek)}: </span>
                      {entry.closed ? (
                        <span className="text-muted-foreground">Closed</span>
                      ) : (
                        <span>
                          {entry.opens ?? '—'} – {entry.closes ?? '—'}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </address>
        </div>

        <div className="min-h-[320px] lg:min-h-[420px] rounded-lg overflow-hidden border border-border bg-card">
          {safeEmbedUrl ? (
            <iframe
              src={safeEmbedUrl}
              title={`Map showing ${businessName}`}
              className="w-full h-full min-h-[320px] lg:min-h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground p-6 text-center">
              Map URL missing or invalid. Edit this block and paste the Google Maps embed URL.
            </div>
          )}
        </div>
      </div>

      {/*
        JSON-LD structured data — tells Google this page describes a physical
        hardware store at a specific address. Helps with local SEO and the
        "ferreterías cerca de mí" search results on Google Maps.
        We inject it via dangerouslySetInnerHTML because Next strips JSON.stringify
        results otherwise.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatDays(days: OpeningHour['daysOfWeek']): string {
  if (!days || days.length === 0) return ''
  if (days.length === 1) return DAY_LABELS[days[0]!] ?? days[0]!
  return days.map((d: DayOfWeek) => DAY_LABELS[d] ?? d).join(', ')
}

type JsonLdArgs = Pick<
  LocationBlockProps,
  | 'businessName'
  | 'description'
  | 'address'
  | 'phone'
  | 'email'
  | 'geo'
  | 'openingHours'
  | 'priceRange'
>

function buildLocalBusinessJsonLd(args: JsonLdArgs) {
  const {
    businessName,
    description,
    address,
    phone,
    email,
    geo,
    openingHours,
    priceRange,
  } = args

  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HardwareStore',
    name: businessName,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address?.streetAddress,
      addressLocality: address?.addressLocality,
      postalCode: address?.postalCode,
      addressCountry: address?.addressCountry,
      ...(address?.addressRegion ? { addressRegion: address.addressRegion } : {}),
    },
    telephone: phone,
    ...(email ? { email } : {}),
    ...(description ? { description } : {}),
    ...(priceRange ? { priceRange } : {}),
  }

  if (
    geo &&
    typeof geo.latitude === 'number' &&
    typeof geo.longitude === 'number'
  ) {
    ld.geo = {
      '@type': 'GeoCoordinates',
      latitude: geo.latitude,
      longitude: geo.longitude,
    }
  }

  if (Array.isArray(openingHours) && openingHours.length > 0) {
    ld.openingHoursSpecification = openingHours
      .filter((h) => Array.isArray(h.daysOfWeek) && h.daysOfWeek.length > 0)
      .map((h) => {
        if (h.closed) {
          return {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: h.daysOfWeek,
            opens: '00:00',
            closes: '00:00',
          }
        }
        return {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: h.daysOfWeek,
          opens: h.opens,
          closes: h.closes,
        }
      })
  }

  return ld
}
