'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { resolveFontFamily } from '@/fields/fontFamilySelect'
import { cn } from '@/utilities/ui'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { useGoogleFont } from '@/utilities/useGoogleFont'

import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Media, Page, Post } from '@/payload-types'

// We type props locally instead of importing from `@/payload-types` so the
// component compiles cleanly the first time you pull this code, before
// Payload has regenerated types from the new block config. After your next
// `pnpm dev` (or `pnpm payload generate:types`) there will be a generated
// `ServiciosSoriaBlock` interface you can swap to if you prefer.
type CmsLinkData = {
  type?: 'reference' | 'custom' | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    // CMSLink expects the populated document (Page | Post) at runtime; in
    // practice we may receive a partial doc or just an id from the API. We
    // accept the looser shape here and rely on the cast at the call site.
    value: number | string | Page | Post
  } | null
  url?: string | null
  label?: string | null
}

type ServiceCard = {
  id?: string | null
  image: Media | number
  label?: DefaultTypedEditorState | null
  description?: DefaultTypedEditorState | null
  cta?: CmsLinkData | null
}

type ServiciosSoriaProps = {
  anchorId?: string | null
  eyebrow?: string | null
  title?: DefaultTypedEditorState | null
  subtitle?: DefaultTypedEditorState | null
  services?: ServiceCard[] | null
  autoplay?: boolean | null
  autoplayMs?: number | null
  backgroundColor?: string | null
  // Per-text appearance overrides. When color is empty the block falls back to
  // currentColor / muted-foreground; when fontFamily is "default" (or empty)
  // we keep the MicroVisuals-aligned defaults from globals.css.
  titleColor?: string | null
  titleFontFamily?: string | null
  subtitleColor?: string | null
  subtitleFontFamily?: string | null
  cardTextColor?: string | null
  cardFontFamily?: string | null
  // Top-right pill CTA on the active card. Empty fields fall back to the
  // default white pill defined in the component.
  ctaBackgroundColor?: string | null
  ctaTextColor?: string | null
  ctaFontFamily?: string | null
  blockType?: 'serviciosSoria'
  disableInnerContainer?: boolean
}

/**
 * Casa Soria — "Servicios" block.
 *
 * Renders a horizontal carousel where the active card is expanded (showing
 * the description and a CTA in the top-right) while the rest are shown as
 * narrow cards with just the bottom label. Clicking a small card promotes
 * it to active; an autoplay timer advances through cards on a configurable
 * interval and pauses on hover or after a manual interaction.
 *
 * Default typography intentionally mirrors the MicroVisuals hero (`hero-title`
 * heading style, `font-body` light captions) so both sections feel like part
 * of the same visual language. Text fields are rich text so editors can
 * override per-card emphasis when they need to.
 */
export const ServiciosSoriaBlock: React.FC<ServiciosSoriaProps> = ({
  anchorId,
  eyebrow,
  title,
  subtitle,
  services,
  autoplay = true,
  autoplayMs = 4500,
  backgroundColor,
  titleColor,
  titleFontFamily,
  subtitleColor,
  subtitleFontFamily,
  cardTextColor,
  cardFontFamily,
  ctaBackgroundColor,
  ctaTextColor,
  ctaFontFamily,
}) => {
  const cards = Array.isArray(services) ? services.filter((s) => s && typeof s === 'object') : []
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const interactedRef = useRef(false)
  // Refs for the scrollable track + each card so we can keep the active card
  // centered in the viewport as autoplay (or a dot click) advances it.
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Resolve the font families once so we can both load them via Google Fonts
  // and pass them as inline styles to the matching elements.
  const titleFont = resolveFontFamily(titleFontFamily)
  const subtitleFont = resolveFontFamily(subtitleFontFamily)
  const cardFont = resolveFontFamily(cardFontFamily)
  const ctaFont = resolveFontFamily(ctaFontFamily)

  // useGoogleFont is a no-op when the family is undefined or not a Google font.
  useGoogleFont(titleFont)
  useGoogleFont(subtitleFont)
  useGoogleFont(cardFont)
  useGoogleFont(ctaFont)

  const safeInterval = Math.max(1500, Math.min(autoplayMs ?? 4500, 20000))
  const wantsAutoplay = autoplay !== false && cards.length > 1

  useEffect(() => {
    if (!wantsAutoplay || paused) return
    const id = window.setInterval(() => {
      setActive((curr) => (curr + 1) % cards.length)
    }, safeInterval)
    return () => window.clearInterval(id)
  }, [cards.length, paused, safeInterval, wantsAutoplay])

  // Keep the active card visible inside the scrollable track. We scroll the
  // track itself (not the page) so the section stays anchored while the
  // carousel slides horizontally — true carousel behavior on all breakpoints.
  useEffect(() => {
    const track = trackRef.current
    const card = cardRefs.current[active]
    if (!track || !card) return
    const targetLeft = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2
    track.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' })
  }, [active])

  const handleActivate = useCallback(
    (index: number) => {
      setActive(index)
      interactedRef.current = true
      // After a manual interaction we briefly pause autoplay so the user has
      // a chance to read what they selected before the next slide steals focus.
      setPaused(true)
      window.setTimeout(() => {
        // Only resume if no further interaction happened in the meantime.
        if (interactedRef.current) {
          interactedRef.current = false
          setPaused(false)
        }
      }, safeInterval * 1.5)
    },
    [safeInterval],
  )

  if (cards.length === 0) return null

  return (
    <section
      id={anchorId ?? undefined}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: backgroundColor ?? undefined }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        interactedRef.current = false
        setPaused(false)
      }}
    >
      <div className="container py-20 lg:py-28">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <header className="max-w-4xl">
          {eyebrow ? (
            <p
              className="mb-3 font-body text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground"
              style={{
                color: subtitleColor ?? undefined,
                fontFamily: subtitleFont,
              }}
            >
              {eyebrow}
            </p>
          ) : null}

          {title ? (
            <div
              className="servicios-soria-title"
              style={{
                color: titleColor ?? undefined,
                fontFamily: titleFont,
              }}
            >
              <RichText data={title} enableGutter={false} enableProse={false} />
            </div>
          ) : null}

          {subtitle ? (
            <div
              className="servicios-soria-subtitle mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg"
              style={{
                color: subtitleColor ?? undefined,
                fontFamily: subtitleFont,
              }}
            >
              <RichText data={subtitle} enableGutter={false} enableProse={false} />
            </div>
          ) : null}
        </header>

        {/* ── Carousel ──────────────────────────────────────────────── */}
        <div className="mt-10 lg:mt-14">
          <div
            ref={trackRef}
            className={cn(
              'flex gap-3 sm:gap-4 lg:gap-5 overflow-x-auto scroll-smooth pb-2',
              // Inline padding gives the first/last card breathing room against
              // the section edge so they never look "chopped off". The
              // scroll-padding values keep snap-target centering in sync.
              'px-4 sm:px-6 lg:px-10 scroll-px-4 sm:scroll-px-6 lg:scroll-px-10',
              // Proximity snap (no `mandatory`) keeps the scroll-smooth motion
              // continuous instead of jerking to the nearest snap point at the
              // tail end of each programmatic scroll. Cards still snap when the
              // user drags manually, just without the forced tug.
              'snap-x',
              // Hide the native scrollbar — the dots act as the visual progress
              // indicator and a scrollbar would clutter the design.
              '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
            )}
            role="tablist"
            aria-label="Servicios"
          >
            {cards.map((card, idx) => (
              <ServiceCardItem
                key={card.id ?? idx}
                ref={(el) => {
                  cardRefs.current[idx] = el
                }}
                card={card}
                isActive={idx === active}
                index={idx}
                onActivate={handleActivate}
                textColor={cardTextColor ?? undefined}
                fontFamily={cardFont}
                ctaBackgroundColor={ctaBackgroundColor ?? undefined}
                ctaTextColor={ctaTextColor ?? undefined}
                ctaFontFamily={ctaFont}
              />
            ))}
          </div>

          {/* ── Progress dots ─────────────────────────────────────────── */}
          {cards.length > 1 ? (
            <div className="mt-8 flex items-center justify-center gap-2">
              {cards.map((_, idx) => (
                <button
                  type="button"
                  key={idx}
                  aria-label={`Ir al servicio ${idx + 1}`}
                  aria-selected={idx === active}
                  role="tab"
                  onClick={() => handleActivate(idx)}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-500',
                    idx === active
                      ? 'w-8 bg-foreground'
                      : 'w-1.5 bg-foreground/30 hover:bg-foreground/60',
                  )}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Card
// ─────────────────────────────────────────────────────────────────────────────

type ServiceCardItemProps = {
  card: ServiceCard
  isActive: boolean
  index: number
  onActivate: (index: number) => void
  textColor?: string
  fontFamily?: string
  ctaBackgroundColor?: string
  ctaTextColor?: string
  ctaFontFamily?: string
}

const ServiceCardItem = React.forwardRef<HTMLButtonElement, ServiceCardItemProps>(function ServiceCardItem(
  {
    card,
    isActive,
    index,
    onActivate,
    textColor,
    fontFamily,
    ctaBackgroundColor,
    ctaTextColor,
    ctaFontFamily,
  },
  ref,
) {
  const { image, label, description, cta } = card

  const media = typeof image === 'object' && image !== null ? image : null
  const imageUrl = media?.url ? getMediaUrl(media.url) : null
  const alt = (media?.alt as string | undefined) ?? ''

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      onClick={() => onActivate(index)}
      className={cn(
        'group relative shrink-0 snap-center overflow-hidden rounded-3xl border border-black/5 text-left shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40',
        // No `transition-[width]` here: animating the width while the track is
        // smooth-scrolling causes a jolt at the end of each auto-advance. The
        // width snaps instantly and the apparent motion comes from the track's
        // smooth scroll. We keep transform/opacity transitions for hover.
        'transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        // True horizontal carousel on every breakpoint. Sizes are slightly
        // smaller than before so multiple cards stay fully visible at once and
        // the "peek" of the next card looks intentional, not chopped off.
        'h-[400px] sm:h-[440px] lg:h-[460px]',
        isActive
          ? 'w-[72vw] sm:w-[52vw] lg:w-[40vw] xl:w-[36vw]'
          : 'w-[56vw] sm:w-[40vw] lg:w-[26vw] xl:w-[22vw]',
      )}
    >
      {/* Background image */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes="(max-width: 640px) 72vw, (max-width: 1024px) 52vw, 40vw"
          priority={index === 0}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 bg-muted" />
      )}

      {/* Vignette to make the bottom label legible regardless of the photo */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

      {/* Top-right CTA — only visible when card is active */}
      {isActive && cta?.label ? (
        <div
          className={cn(
            'absolute top-4 right-4 transition-all duration-500',
            isActive
              ? 'translate-y-0 opacity-100 delay-200'
              : 'pointer-events-none -translate-y-2 opacity-0',
          )}
        >
          <CMSLink
            appearance="inline"
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium shadow-md backdrop-blur-md transition-transform hover:scale-[1.03] active:scale-[0.97]',
              // Tailwind defaults only apply when the editor hasn't picked a
              // custom value; inline styles below win when they exist.
              !ctaBackgroundColor && 'bg-white/95',
              !ctaTextColor && 'text-foreground',
            )}
            style={{
              backgroundColor: ctaBackgroundColor,
              color: ctaTextColor,
              fontFamily: ctaFontFamily,
            }}
            label={cta.label}
            newTab={cta.newTab ?? undefined}
            reference={cta.reference ?? undefined}
            type={cta.type ?? undefined}
            url={cta.url ?? undefined}
          >
            <span>{cta.label}</span>
            <ArrowUpRight className="size-3.5" strokeWidth={2} />
          </CMSLink>
        </div>
      ) : null}

      {/* Bottom info pane — label always, description only when active */}
      <div className="absolute inset-x-3 bottom-3 flex flex-col gap-2 sm:inset-x-4 sm:bottom-4">
        {label ? (
          <div
            className={cn(
              'inline-flex w-fit max-w-full items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 text-sm font-medium text-foreground shadow-sm backdrop-blur-md',
              'servicios-soria-label',
            )}
            style={{ color: textColor, fontFamily }}
          >
            <span className="inline-block size-2 rounded-full bg-emerald-500" aria-hidden />
            <span className="truncate">
              <RichText data={label} enableGutter={false} enableProse={false} />
            </span>
          </div>
        ) : null}

        {description ? (
          <div
            className={cn(
              'rounded-2xl bg-white/95 px-4 py-3 text-sm text-foreground shadow-md backdrop-blur-md transition-all duration-500',
              'servicios-soria-description',
              isActive
                ? 'max-h-40 translate-y-0 opacity-100 delay-150'
                : 'pointer-events-none max-h-0 translate-y-2 overflow-hidden p-0 opacity-0',
            )}
            style={{ color: textColor, fontFamily }}
          >
            <RichText data={description} enableGutter={false} enableProse={false} />
          </div>
        ) : null}
      </div>
    </button>
  )
})

export default ServiciosSoriaBlock
