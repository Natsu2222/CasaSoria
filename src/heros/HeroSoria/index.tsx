'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { useGoogleFont } from '@/utilities/useGoogleFont'
import { resolveFontFamily } from '@/fields/fontFamilySelect'

import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Media, Page, Post } from '@/payload-types'

// ─────────────────────────────────────────────────────────────────────────────
// Hero Soria
//
// Static reference (see uploaded recording):
//   - Centered headline + small subtitle on a soft cream background.
//   - Below the copy, an horizontal row of polaroid-styled cards (tilted
//     at alternating angles, subtle drop shadow, rounded corners).
//   - Optional eyebrow and up to two CTA buttons.
//
// All text fields are rich-text; colors and font families are configurable
// from the admin and applied here via inline styles so editors get full
// control without touching CSS.
// ─────────────────────────────────────────────────────────────────────────────

type CmsLinkData = {
  type?: 'reference' | 'custom' | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: number | string | Page | Post
  } | null
  url?: string | null
  label?: string | null
}

// Buttons rows use the shared `link()` helper which nests link fields under
// a `link` group. The remaining visual fields (appearance/font/colors) live
// at the button level. We keep the legacy flat shape too so older content
// or custom payloads keep working without a migration.
type HeroButton = {
  id?: string | null
  appearance?: 'primary' | 'secondary' | null
  fontFamily?: string | null
  backgroundColor?: string | null
  textColor?: string | null
  link?: CmsLinkData | null
} & CmsLinkData

type GalleryCard = {
  id?: string | null
  image: Media | number | string
  rotation?: number | null
  alt?: string | null
}

type HeroSoriaData = {
  eyebrow?: DefaultTypedEditorState | null
  title?: DefaultTypedEditorState | null
  subtitle?: DefaultTypedEditorState | null
  buttons?: HeroButton[] | null
  gallery?: GalleryCard[] | null
  titleColor?: string | null
  titleFontFamily?: string | null
  subtitleColor?: string | null
  subtitleFontFamily?: string | null
  eyebrowColor?: string | null
  eyebrowFontFamily?: string | null
  backgroundColor?: string | null
}

// `Page['hero']` doesn't yet include the heroSoria type until Payload
// regenerates types, so we extend the legacy hero props with an optional
// `heroSoria` block. After your next `pnpm dev`, the generated `Page['hero']`
// will include this field and the cast becomes unnecessary.
type HeroProps = Page['hero'] & { heroSoria?: HeroSoriaData | null }

export const HeroSoriaHero: React.FC<HeroProps> = (props) => {
  const data = (props.heroSoria ?? {}) as HeroSoriaData
  const {
    eyebrow,
    title,
    subtitle,
    buttons,
    gallery,
    titleColor,
    titleFontFamily,
    subtitleColor,
    subtitleFontFamily,
    eyebrowColor,
    eyebrowFontFamily,
    backgroundColor,
  } = data

  const titleFont = resolveFontFamily(titleFontFamily)
  const subtitleFont = resolveFontFamily(subtitleFontFamily)
  const eyebrowFont = resolveFontFamily(eyebrowFontFamily)

  // Best-effort dynamic loading of Google fonts when the editor picks one.
  useGoogleFont(titleFont)
  useGoogleFont(subtitleFont)
  useGoogleFont(eyebrowFont)

  // Trigger the entrance animation after first paint so the hero "drops in"
  // gracefully, including when navigating via client-side routing.
  const [entered, setEntered] = useState(false)
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setEntered(true))
    return () => window.cancelAnimationFrame(id)
  }, [])

  const cards = Array.isArray(gallery) ? gallery.filter(Boolean) : []
  const ctaButtons = Array.isArray(buttons) ? buttons.filter(Boolean).slice(0, 2) : []

  // Default tilt pattern when the editor doesn't override per-card rotation:
  //   alternating ±, slightly steeper at the edges, calmer towards the centre.
  const defaultRotations = useMemo(() => {
    const total = cards.length || 1
    return cards.map((_, i) => {
      const offsetFromCenter = i - (total - 1) / 2
      // Wave shape: edges ±8°, centre ~0°. Sign flips with index for variety.
      const base = (Math.abs(offsetFromCenter) / Math.max(1, (total - 1) / 2)) * 8
      const sign = i % 2 === 0 ? -1 : 1
      return Math.round(sign * base * 10) / 10
    })
  }, [cards])

  return (
    <section
      // The page-level `<article>` wraps every hero with `pt-16` so legacy
      // heroes get breathing room below the header. Hero Soria sits flush
      // under the sticky navbar, so we cancel that padding with a matching
      // negative top margin — keeping the cream background glued to the bar.
      className="relative -mt-16 w-full overflow-hidden"
      style={{
        background:
          backgroundColor ??
          'radial-gradient(120% 80% at 50% 0%, #ffffff 0%, #f6f3ec 60%, #ecebe3 100%)',
      }}
    >
      <div className="container relative z-10 pt-24 pb-12 lg:pt-32 lg:pb-20">
        {/* ── Header (eyebrow + title + subtitle) ───────────────────────── */}
        <header
          className={cn(
            'mx-auto max-w-4xl text-center transition-all duration-1000 ease-out',
            entered ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
          )}
        >
          {eyebrow ? (
            <div
              className="hero-soria-eyebrow mb-4 text-xs font-medium uppercase tracking-[0.25em] text-foreground/60"
              // We expose the font as a CSS variable so the global stylesheet
              // (which sets `font-family` directly on the rich-text children)
              // can pick it up — a plain `fontFamily` here would be overridden.
              style={
                {
                  color: eyebrowColor ?? undefined,
                  '--hero-soria-eyebrow-font': eyebrowFont ?? undefined,
                } as React.CSSProperties
              }
            >
              <RichText data={eyebrow} enableGutter={false} enableProse={false} />
            </div>
          ) : null}

          {title ? (
            <div
              className="hero-soria-title"
              style={
                {
                  color: titleColor ?? undefined,
                  '--hero-soria-title-font': titleFont ?? undefined,
                } as React.CSSProperties
              }
            >
              <RichText data={title} enableGutter={false} enableProse={false} />
            </div>
          ) : null}

          {subtitle ? (
            <div
              className="hero-soria-subtitle mx-auto mt-3 max-w-2xl text-base text-foreground/65 sm:text-lg"
              style={
                {
                  color: subtitleColor ?? undefined,
                  '--hero-soria-subtitle-font': subtitleFont ?? undefined,
                } as React.CSSProperties
              }
            >
              <RichText data={subtitle} enableGutter={false} enableProse={false} />
            </div>
          ) : null}

          {/* ── Buttons ───────────────────────────────────────────────── */}
          {ctaButtons.length > 0 ? (
            <div
              className={cn(
                '-mt-8 flex flex-row flex-wrap items-center justify-center gap-3 sm:-mt-12 sm:gap-4',
                'transition-all duration-1000 ease-out delay-200',
                entered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
              )}
            >
              {ctaButtons.map((btn, i) => (
                <HeroButtonNode key={btn.id ?? i} button={btn} bodyFont={subtitleFont} />
              ))}
            </div>
          ) : null}
        </header>

        {/* ── Gallery (polaroid row) ───────────────────────────────────── */}
        {/*
          Cards overlap horizontally via negative `space-x-*` (Tailwind 4).
          We avoid `flex-wrap` so the polaroids always stay on a single row
          and the overlap reads as intended. If the row is wider than the
          viewport on narrow screens, the parent `<section>` (which has
          `overflow-hidden`) clips the edges — no scrollable area, only the
          hover effect on the cards remains.
        */}
        {cards.length > 0 ? (
          <div
            className="mt-2 flex items-center justify-center -space-x-4 sm:mt-1 sm:-space-x-6 lg:mt-3 lg:-space-x-10"
            role="list"
            aria-label="Galería"
          >
            {cards.map((card, idx) => (
              <PolaroidCard
                key={card.id ?? idx}
                card={card}
                index={idx}
                total={cards.length}
                rotation={card.rotation ?? defaultRotations[idx] ?? 0}
                entered={entered}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

const PolaroidCard: React.FC<{
  card: GalleryCard
  index: number
  total: number
  rotation: number
  entered: boolean
}> = ({ card, index, total, rotation, entered }) => {
  const media = typeof card.image === 'object' && card.image !== null ? (card.image as Media) : null
  const imageUrl = media?.url ? getMediaUrl(media.url) : null
  const alt = (card.alt ?? (media?.alt as string | undefined) ?? '').trim()

  // Cards closer to the centre sit on top of those near the edges so the
  // overlap reads as a fanned-out stack (matches the design reference).
  const center = (total - 1) / 2
  const distanceFromCenter = Math.abs(index - center)
  const baseZ = Math.max(1, Math.round(total - distanceFromCenter))

  // Stagger entrance: each card delays ~80ms after the previous so the row
  // flows in left-to-right instead of all at once.
  const enterStyle: React.CSSProperties = {
    transitionDelay: entered ? `${300 + index * 80}ms` : '0ms',
    // While transitioning out (initial), no rotation so the card slides up
    // straight; once it has entered, the configured rotation kicks in.
    transform: entered ? `translateY(0) rotate(${rotation}deg)` : 'translateY(28px) rotate(0deg)',
    opacity: entered ? 1 : 0,
    zIndex: baseZ,
  }

  return (
    <div
      role="listitem"
      className={cn(
        'group relative aspect-[3/4] w-[34vw] max-w-[170px] shrink-0 overflow-hidden rounded-2xl',
        'sm:w-[22vw] sm:max-w-[200px] lg:w-[15vw] lg:max-w-[220px]',
        'bg-white p-1.5 shadow-[0_22px_45px_-22px_rgba(15,23,42,0.35)]',
        'transition-[transform,box-shadow,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform',
        'hover:scale-[1.04] hover:rotate-0 hover:shadow-[0_30px_55px_-22px_rgba(15,23,42,0.45)] hover:z-[60]',
      )}
      style={enterStyle}
    >
      <div className="relative h-full w-full overflow-hidden rounded-xl">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={alt}
            fill
            sizes="(max-width: 640px) 40vw, (max-width: 1024px) 28vw, 16vw"
            priority={index === 0}
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}
      </div>
    </div>
  )
}

const HeroButtonNode: React.FC<{
  button: HeroButton
  bodyFont: string | undefined
}> = ({ button, bodyFont }) => {
  const fontFamily = resolveFontFamily(button.fontFamily) ?? bodyFont
  const appearance = button.appearance ?? 'primary'
  const isPrimary = appearance === 'primary'

  // The shared `link()` helper nests the link fields under `button.link`.
  // Fall back to the top-level shape so any legacy/flat data still works.
  const linkData: CmsLinkData = button.link ?? {
    type: button.type,
    newTab: button.newTab,
    reference: button.reference,
    url: button.url,
    label: button.label,
  }

  const inlineStyle: React.CSSProperties = {
    fontFamily,
    ...(button.backgroundColor ? { backgroundColor: button.backgroundColor } : {}),
    ...(button.textColor ? { color: button.textColor } : {}),
  }

  // `CMSLink` already renders the label when `appearance="inline"`, so we
  // must not pass it again as children — that would duplicate the label.
  return (
    <CMSLink
      appearance="inline"
      className={cn(
        'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-all duration-200',
        'hover:scale-[1.03] active:scale-[0.97]',
        isPrimary
          ? 'bg-foreground text-background shadow-[0_8px_24px_-12px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_28px_-12px_rgba(0,0,0,0.45)]'
          : 'border border-foreground/15 bg-white/70 text-foreground backdrop-blur-md hover:bg-white',
      )}
      style={inlineStyle}
      label={linkData.label ?? undefined}
      newTab={linkData.newTab ?? undefined}
      reference={linkData.reference ?? undefined}
      type={linkData.type ?? undefined}
      url={linkData.url ?? undefined}
    />
  )
}

export default HeroSoriaHero
