'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import RichText from '@/components/RichText'
import { resolveFontFamily } from '@/fields/fontFamilySelect'
import { cn } from '@/utilities/ui'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { useGoogleFont } from '@/utilities/useGoogleFont'

import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Media } from '@/payload-types'

// Tipamos las props localmente porque la primera vez que se añade el bloque
// Payload aún no ha regenerado `payload-types.ts`. Tras ejecutar
// `pnpm generate:types` se podría sustituir por la interfaz `TestimonialsBlock`
// autogenerada.
type TestimonialItem = {
  id?: string | null
  avatar?: Media | number | null
  quote: DefaultTypedEditorState
  attribution?: DefaultTypedEditorState | null
  name: DefaultTypedEditorState
  role?: DefaultTypedEditorState | null
}

type TestimonialsProps = {
  anchorId?: string | null
  backgroundImage: Media | number
  items?: TestimonialItem[] | null
  autoplay?: boolean | null
  autoplayMs?: number | null

  // Sección
  backgroundColor?: string | null
  accentColor?: string | null
  maxWidth?: string | null
  minHeight?: string | null

  // Tarjeta
  cardBackgroundColor?: string | null
  cardShadow?: string | null

  // Cita
  quoteColor?: string | null
  quoteFontFamily?: string | null
  attributionColor?: string | null
  attributionFontFamily?: string | null

  // Nombre y cargo
  nameColor?: string | null
  nameFontFamily?: string | null
  roleColor?: string | null
  roleFontFamily?: string | null

  // Controles
  arrowColor?: string | null
  arrowBackgroundColor?: string | null
  dotColor?: string | null
  dotActiveColor?: string | null

  blockType?: 'testimonials'
  disableInnerContainer?: boolean
}

/**
 * Casa Soria — bloque "Testimonios".
 *
 * Renderiza una imagen grande a la izquierda con una banda decorativa
 * de color a la derecha y, encima, una tarjeta blanca con la cita,
 * el avatar circular del autor, su nombre y su cargo. Incluye flechas
 * para navegar entre testimonios y puntos de paginación. Cuando se
 * activa "Avance automático" desde el admin, los testimonios cambian
 * uno a uno con el intervalo configurado.
 */
export const TestimonialsBlock: React.FC<TestimonialsProps> = ({
  anchorId,
  backgroundImage,
  items,
  autoplay,
  autoplayMs,
  backgroundColor,
  accentColor,
  maxWidth,
  minHeight,
  cardBackgroundColor,
  cardShadow,
  quoteColor,
  quoteFontFamily,
  attributionColor,
  attributionFontFamily,
  nameColor,
  nameFontFamily,
  roleColor,
  roleFontFamily,
  arrowColor,
  arrowBackgroundColor,
  dotColor,
  dotActiveColor,
}) => {
  const testimonials = Array.isArray(items)
    ? items.filter((it) => it && typeof it === 'object')
    : []

  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const interactedRef = useRef(false)

  const quoteFont = resolveFontFamily(quoteFontFamily)
  const attributionFont = resolveFontFamily(attributionFontFamily)
  const nameFont = resolveFontFamily(nameFontFamily)
  const roleFont = resolveFontFamily(roleFontFamily)

  useGoogleFont(quoteFont)
  useGoogleFont(attributionFont)
  useGoogleFont(nameFont)
  useGoogleFont(roleFont)

  const safeInterval = Math.max(1500, Math.min(autoplayMs ?? 5000, 20000))
  const wantsAutoplay = autoplay === true && testimonials.length > 1

  // Avance automático configurable desde el admin. Se pausa al pasar el ratón
  // sobre la sección o tras una interacción manual, para no robarle el foco
  // al lector mientras está leyendo.
  useEffect(() => {
    if (!wantsAutoplay || paused) return
    const id = window.setInterval(() => {
      setActive((curr) => (curr + 1) % testimonials.length)
    }, safeInterval)
    return () => window.clearInterval(id)
  }, [testimonials.length, paused, safeInterval, wantsAutoplay])

  // Si el editor reordena/elimina ítems en live preview, mantenemos un índice válido.
  useEffect(() => {
    if (active >= testimonials.length) {
      setActive(Math.max(0, testimonials.length - 1))
    }
  }, [testimonials.length, active])

  const goTo = useCallback(
    (index: number) => {
      if (testimonials.length === 0) return
      const next = (index + testimonials.length) % testimonials.length
      setActive(next)
      interactedRef.current = true
      setPaused(true)
      window.setTimeout(() => {
        if (interactedRef.current) {
          interactedRef.current = false
          setPaused(false)
        }
      }, safeInterval * 1.5)
    },
    [safeInterval, testimonials.length],
  )

  const goPrev = useCallback(() => goTo(active - 1), [active, goTo])
  const goNext = useCallback(() => goTo(active + 1), [active, goTo])

  const bgMedia =
    typeof backgroundImage === 'object' && backgroundImage !== null ? backgroundImage : null
  const bgUrl = bgMedia?.url ? getMediaUrl(bgMedia.url) : null
  const bgAlt = (bgMedia?.alt as string | undefined) ?? ''

  if (testimonials.length === 0 || !bgUrl) return null

  const current = testimonials[active]
  if (!current) return null

  const currentAvatar =
    typeof current.avatar === 'object' && current.avatar !== null ? current.avatar : null
  const avatarUrl = currentAvatar?.url ? getMediaUrl(currentAvatar.url) : null
  const avatarAlt = (currentAvatar?.alt as string | undefined) ?? ''

  const resolvedMaxWidth = maxWidth ?? '100%'
  const isFullBleed = resolvedMaxWidth === '100%' || resolvedMaxWidth === '100vw'

  return (
    <section
      id={anchorId ?? undefined}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: backgroundColor ?? '#ffffff' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        interactedRef.current = false
        setPaused(false)
      }}
    >
      <div
        className={cn('w-full', !isFullBleed && 'mx-auto')}
        style={{ maxWidth: resolvedMaxWidth }}
      >
        <div
          className="relative w-full lg:min-h-[532px]"
          style={{ minHeight: minHeight ?? '460px' }}
        >
          {/* ── Panel de color decorativo (banda derecha, 32%) ─────────── */}
          <div
            aria-hidden
            className="absolute inset-y-0 right-0 hidden w-[32%] lg:block"
            style={{ backgroundColor: accentColor ?? '#143b5b' }}
          />

          {/* ── Imagen de fondo (panel izquierdo, 68%) ──────────────────── */}
          <div className="relative h-[420px] w-full overflow-hidden sm:h-[480px] lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-[68%]">
            <Image
              src={bgUrl}
              alt={bgAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 68vw"
              priority
              className="object-cover"
            />
          </div>

          {/* ── Tarjeta: centrada 50/50 sobre el límite imagen / panel ─── */}
          <div className="relative z-10 mx-auto -mt-24 w-full max-w-md px-4 sm:-mt-32 sm:px-6 lg:absolute lg:top-1/2 lg:left-[68%] lg:mt-0 lg:w-[471px] lg:max-w-none lg:-translate-x-1/2 lg:-translate-y-1/2 lg:px-0">
            <article
              className="relative flex min-h-[420px] flex-col rounded-sm px-6 pb-10 pt-10 sm:px-10 sm:pb-12 sm:pt-12 lg:h-[532px] lg:w-[471px] lg:px-12 lg:pb-10 lg:pt-12"
              style={{
                backgroundColor: cardBackgroundColor ?? '#ffffff',
                boxShadow: cardShadow ?? '0 30px 60px -30px rgba(0,0,0,0.35)',
              }}
            >
              {/* Avatar circular dentro de la tarjeta */}
              <div className="mb-6 flex shrink-0 justify-center lg:mb-8">
                <div className="size-16 overflow-hidden rounded-full bg-white shadow-md sm:size-20 lg:size-[83px]">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={avatarAlt}
                      width={83}
                      height={83}
                      sizes="(max-width: 1024px) 80px, 83px"
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="size-full bg-muted" />
                  )}
                </div>
              </div>

              {/* Flechas de navegación (dentro de la tarjeta) */}
              {testimonials.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Testimonio anterior"
                    className={cn(
                      'absolute top-1/2 left-2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-sm transition-opacity hover:opacity-100 lg:left-4 lg:size-14',
                      'opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40',
                    )}
                    style={{
                      backgroundColor: arrowBackgroundColor ?? 'transparent',
                      color: arrowColor ?? '#0a0a0a',
                    }}
                  >
                    <ChevronLeft className="size-5 lg:size-7" strokeWidth={1.5} />
                  </button>

                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Siguiente testimonio"
                    className={cn(
                      'absolute top-1/2 right-2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-sm transition-opacity hover:opacity-100 lg:right-4 lg:size-14',
                      'opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40',
                    )}
                    style={{
                      backgroundColor: arrowBackgroundColor ?? 'transparent',
                      color: arrowColor ?? '#0a0a0a',
                    }}
                  >
                    <ChevronRight className="size-5 lg:size-7" strokeWidth={1.5} />
                  </button>
                </>
              ) : null}

              {/* Contenido central */}
              <div className="flex min-h-0 flex-1 flex-col justify-center px-8 lg:px-10">
                {/* Cita */}
                <div
                  className="testimonials-quote text-center text-sm leading-relaxed sm:text-base"
                  style={{
                    color: quoteColor ?? '#475569',
                    fontFamily: quoteFont,
                  }}
                >
                  <RichText data={current.quote} enableGutter={false} enableProse={false} />
                </div>

                {/* Atribución opcional */}
                {current.attribution ? (
                  <div
                    className="testimonials-attribution mt-4 text-center text-xs sm:text-sm"
                    style={{
                      color: attributionColor ?? '#64748b',
                      fontFamily: attributionFont,
                    }}
                  >
                    <RichText
                      data={current.attribution}
                      enableGutter={false}
                      enableProse={false}
                    />
                  </div>
                ) : null}

                {/* Nombre */}
                <div
                  className="testimonials-name mt-6 text-center text-base font-semibold sm:text-lg"
                  style={{
                    color: nameColor ?? '#0a0a0a',
                    fontFamily: nameFont,
                  }}
                >
                  <RichText data={current.name} enableGutter={false} enableProse={false} />
                </div>

                {/* Cargo */}
                {current.role ? (
                  <div
                    className="testimonials-role mt-1 text-center text-xs sm:text-sm"
                    style={{
                      color: roleColor ?? '#64748b',
                      fontFamily: roleFont,
                    }}
                  >
                    <RichText data={current.role} enableGutter={false} enableProse={false} />
                  </div>
                ) : null}
              </div>

              {/* Puntos de paginación */}
              {testimonials.length > 1 ? (
                <div className="mt-auto flex shrink-0 items-center justify-center gap-2 pt-6">
                  {testimonials.map((_, idx) => (
                    <button
                      type="button"
                      key={idx}
                      aria-label={`Ir al testimonio ${idx + 1}`}
                      aria-selected={idx === active}
                      onClick={() => goTo(idx)}
                      className={cn(
                        'h-1.5 rounded-full transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40',
                        idx === active ? 'w-6' : 'w-1.5 opacity-70 hover:opacity-100',
                      )}
                      style={{
                        backgroundColor:
                          idx === active
                            ? dotActiveColor ?? '#0a0a0a'
                            : dotColor ?? '#cbd5e1',
                      }}
                    />
                  ))}
                </div>
              ) : null}
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsBlock
