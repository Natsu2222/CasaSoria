'use client'

import React, { useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'

import { BtnNegro } from '@/components/BtnNegro'
import { getMediaUrl } from '@/utilities/getMediaUrl'

import type { Media, Page } from '@/payload-types'

function resolveMediaUrl(field: unknown): string | null {
  const media =
    typeof field === 'object' && field !== null ? (field as Media) : null
  return media?.url ? getMediaUrl(media.url) : null
}

export const HeroParallax2Hero: React.FC<Page['hero']> = ({ heroParallax2 }) => {
  const {
    title,
    subtitle,
    cta,
    layers,
    leftBgColor = '#FFC950',
    textColor = '#171714',
    backgroundImage,
    mobileImage,
    mobileTextAlign = 'center',
    height = '600',
  } = heroParallax2 ?? {}

  const resolvedTextColor = textColor ?? '#171714'
  const resolvedLeftBgColor = leftBgColor ?? '#FFC950'

  const heroRef = useRef<HTMLElement>(null)
  const layerRefs = useRef<(HTMLDivElement | null)[]>([])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!heroRef.current) return

      const rect = heroRef.current.getBoundingClientRect()
      const dx = e.clientX - (rect.left + rect.width / 2)
      const dy = e.clientY - (rect.top + rect.height / 2)

      layers?.forEach((layer, index) => {
        const el = layerRefs.current[index]
        if (!el) return
        const value = layer.moveValue ?? 5
        el.style.transform = `translateX(${(dx * value) / 100}px) translateY(${(dy * value) / 100}px)`
      })
    },
    [layers],
  )

  const handleMouseLeave = useCallback(() => {
    layers?.forEach((_, index) => {
      const el = layerRefs.current[index]
      if (el) el.style.transform = 'translateX(0px) translateY(0px)'
    })
  }, [layers])

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    hero.addEventListener('mousemove', handleMouseMove)
    hero.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      hero.removeEventListener('mousemove', handleMouseMove)
      hero.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave])

  const heroHeight = height === '100vh' ? '100vh' : `${height}px`
  const bgUrl = resolveMediaUrl(backgroundImage)
  const mobileUrl = resolveMediaUrl(mobileImage)
  const mobileAlign =
    mobileTextAlign === 'center' ? 'items-center text-center' : 'items-start text-left'
  const mobileImageUrl =
    mobileUrl ?? resolveMediaUrl(layers?.[layers.length - 1]?.image)

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden flex flex-col md:block"
      style={{ height: heroHeight }}
    >
      {/* Mobile: stacked — yellow text block on top, image below */}
      <div className="md:hidden flex flex-col h-full min-h-0">
        <div
          className={[
            'flex flex-col justify-center px-8 py-10',
            mobileImageUrl ? 'flex-1' : 'h-full',
            mobileAlign,
          ].join(' ')}
          style={{ background: resolvedLeftBgColor }}
        >
          {title && (
            <h1
              className="font-extrabold leading-tight mb-4 max-w-md"
              style={{ fontSize: '30px', color: resolvedTextColor }}
            >
              {title}
            </h1>
          )}

          {subtitle && (
            <p
              className="text-sm leading-relaxed mb-8 max-w-md"
              style={{ color: resolvedTextColor }}
            >
              {subtitle}
            </p>
          )}

          {cta?.label && cta?.url && (
            <div className={mobileTextAlign === 'center' ? 'flex justify-center' : ''}>
              <BtnNegro
                href={cta.url}
                target={cta.openInNewTab ? '_blank' : undefined}
              >
                {cta.label}
              </BtnNegro>
            </div>
          )}
        </div>

        {mobileImageUrl && (
          <div className="relative w-full flex-1 min-h-0">
            <Image
              src={mobileImageUrl}
              alt=""
              fill
              priority
              className="object-cover pointer-events-none select-none"
              sizes="100vw"
            />
          </div>
        )}
      </div>

      {/* Desktop: split layout with mousemove parallax */}
      {bgUrl && (
        <div className="hidden md:block absolute inset-0" aria-hidden="true">
          <Image
            src={bgUrl}
            alt=""
            fill
            priority
            className="object-cover pointer-events-none select-none"
            sizes="100vw"
          />
        </div>
      )}

      <div
        className="hidden md:flex absolute inset-y-0 left-0 z-10 items-center"
        style={{ width: 'min(50%, 680px)', background: resolvedLeftBgColor }}
      >
        <div className="px-10 lg:px-16 max-w-xl">
          {title && (
            <h1
              className="font-extrabold leading-tight mb-4"
              style={{ fontSize: '60px', color: resolvedTextColor }}
            >
              {title}
            </h1>
          )}

          {subtitle && (
            <p
              className="text-base lg:text-lg leading-relaxed mb-8"
              style={{ color: resolvedTextColor }}
            >
              {subtitle}
            </p>
          )}

          {cta?.label && cta?.url && (
            <BtnNegro
              href={cta.url}
              target={cta.openInNewTab ? '_blank' : undefined}
            >
              {cta.label}
            </BtnNegro>
          )}
        </div>
      </div>

      <div
        className="hidden md:block absolute inset-0 overflow-hidden"
        style={{ left: 'min(50%, 680px)', zIndex: 5 }}
        aria-hidden="true"
      >
        {layers?.map((layer, index) => {
          const imageUrl = resolveMediaUrl(layer.image)
          if (!imageUrl) return null

          return (
            <div
              key={layer.id ?? index}
              ref={(el) => {
                layerRefs.current[index] = el
              }}
              className="absolute will-change-transform"
              style={{
                inset: '-50px -50px -70px -50px',
                opacity: layer.opacity ?? 1,
                zIndex: index + 1,
                transition: 'transform 0.1s ease-out',
              }}
            >
              <Image
                src={imageUrl}
                alt={layer.alt ?? ''}
                fill
                priority={index === 0}
                draggable={false}
                className="object-cover pointer-events-none select-none"
                sizes="60vw"
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default HeroParallax2Hero
