'use client'

import React, { useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { getMediaUrl } from '@/utilities/getMediaUrl'

import type { Media, Page } from '@/payload-types'

const HEIGHT_MAP: Record<string, string> = {
  screen: 'h-screen',
  large: 'h-[80vh]',
  medium: 'h-[60vh]',
}

const ALIGN_MAP: Record<string, string> = {
  center: 'items-center text-center',
  left: 'items-start text-left',
  right: 'items-end text-right',
}

export const HeroParallaxHero: React.FC<Page['hero']> = ({ heroParallax }) => {
  const {
    title,
    subtitle,
    cta,
    layers,
    overlayOpacity = 0.5,
    height = 'screen',
    textAlign = 'center',
  } = heroParallax ?? {}

  const layerRefs = useRef<(HTMLDivElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return

    const scrolled = -containerRef.current.getBoundingClientRect().top

    layers?.forEach((layer, index) => {
      const el = layerRefs.current[index]
      if (!el) return
      const speed = layer.speed ?? 0.3
      el.style.transform = `translateY(${scrolled * speed}px)`
    })
  }, [layers])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const heightClass = HEIGHT_MAP[height as string] ?? 'h-screen'
  const alignClass = ALIGN_MAP[textAlign as string] ?? 'items-center text-center'
  const totalLayers = layers?.length ?? 0

  return (
    <section
      ref={containerRef}
      className={['relative overflow-hidden', heightClass].join(' ')}
    >
      {layers?.map((layer, index) => {
        const media =
          typeof layer.image === 'object' && layer.image !== null
            ? (layer.image as Media)
            : null
        const imageUrl = media?.url ? getMediaUrl(media.url) : null

        if (!imageUrl) return null

        return (
          <div
            key={layer.id ?? index}
            ref={(el) => {
              layerRefs.current[index] = el
            }}
            className="absolute inset-0 will-change-transform"
            style={{
              opacity: layer.opacity ?? 1,
              zIndex: index + 1,
              height: '120%',
              top: '-10%',
            }}
          >
            <Image
              src={imageUrl}
              alt={layer.alt ?? ''}
              fill
              priority={index === 0}
              draggable={false}
              className="pointer-events-none select-none"
              style={{
                objectFit: (layer.objectFit as React.CSSProperties['objectFit']) ?? 'cover',
              }}
              sizes="100vw"
            />
          </div>
        )
      })}

      {(overlayOpacity ?? 0) > 0 && (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundColor: `rgba(23, 23, 20, ${overlayOpacity})`,
            zIndex: totalLayers + 1,
          }}
        />
      )}

      <div
        className={[
          'relative flex flex-col justify-center',
          'h-full px-6 md:px-16 max-w-5xl mx-auto gap-6',
          alignClass,
        ].join(' ')}
        style={{ zIndex: totalLayers + 2 }}
      >
        {title && (
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
            {title}
          </h1>
        )}

        {subtitle && (
          <p className="text-lg md:text-xl text-white/80 max-w-2xl">{subtitle}</p>
        )}

        {cta?.label && cta?.url && (
          <div>
            <Link
              href={cta.url}
              target={cta.openInNewTab ? '_blank' : undefined}
              rel={cta.openInNewTab ? 'noopener noreferrer' : undefined}
              className={[
                'inline-block',
                'bg-[#FFC950] text-[#171714]',
                'font-bold text-sm uppercase tracking-widest',
                'px-8 py-3 rounded-sm',
                'transition-colors duration-200',
                'hover:bg-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC950]',
              ].join(' ')}
            >
              {cta.label}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default HeroParallaxHero
