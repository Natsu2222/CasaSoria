'use client'

import React, { useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'

import { BtnNegro } from '@/components/BtnNegro'
import RichText from '@/components/RichText'
import { getMediaUrl } from '@/utilities/getMediaUrl'

import type { Media, Page } from '@/payload-types'

function resolveMedia(field: unknown): Media | null {
  return typeof field === 'object' && field !== null ? (field as Media) : null
}

function resolveMediaUrl(field: unknown): string | null {
  const media = resolveMedia(field)
  return media?.url ? getMediaUrl(media.url) : null
}

const titleClassName = [
  'hero-parallax3-title mb-4 max-w-md font-extrabold leading-tight',
  '[&_h1]:text-[30px] [&_h2]:text-[28px] [&_p]:text-[30px]',
  'md:[&_h1]:text-[60px] md:[&_h2]:text-[52px] md:[&_p]:text-[60px]',
].join(' ')

const subtitleClassName = [
  'hero-parallax3-subtitle text-sm leading-relaxed mb-8 max-w-md',
  'md:text-base lg:text-lg',
].join(' ')

const DESKTOP_HEIGHT_CLASS: Record<string, string> = {
  '500': 'md:h-[500px]',
  '600': 'md:h-[600px]',
  '700': 'md:h-[700px]',
  '100vh': 'md:h-screen',
}

export const HeroParallax3Hero: React.FC<Page['hero']> = ({ heroParallax3 }) => {
  const {
    title,
    subtitle,
    cta,
    layers,
    textColor = '#171714',
    leftBackgroundImage,
    backgroundImage,
    backgroundMoveValue = 3,
    mobileImage,
    mobileTextAlign = 'center',
    mobileBackgroundColor = '#FFC950',
    height = '600',
  } = heroParallax3 ?? {}

  const resolvedTextColor = textColor ?? '#171714'
  const resolvedMobileBgColor = mobileBackgroundColor ?? '#FFC950'

  const heroRef = useRef<HTMLElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const layerRefs = useRef<(HTMLDivElement | null)[]>([])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!heroRef.current) return

      const rect = heroRef.current.getBoundingClientRect()
      const dx = e.clientX - (rect.left + rect.width / 2)
      const dy = e.clientY - (rect.top + rect.height / 2)

      if (backgroundRef.current) {
        const bgValue = backgroundMoveValue ?? 3
        backgroundRef.current.style.transform = `translateX(${(dx * bgValue) / 100}px) translateY(${(dy * bgValue) / 100}px)`
      }

      layers?.forEach((layer, index) => {
        const el = layerRefs.current[index]
        if (!el) return
        const value = layer.moveValue ?? 5
        el.style.transform = `translateX(${(dx * value) / 100}px) translateY(${(dy * value) / 100}px)`
      })
    },
    [backgroundMoveValue, layers],
  )

  const handleMouseLeave = useCallback(() => {
    if (backgroundRef.current) {
      backgroundRef.current.style.transform = 'translateX(0px) translateY(0px)'
    }

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

  const leftBgUrl = resolveMediaUrl(leftBackgroundImage)
  const bgUrl = resolveMediaUrl(backgroundImage)
  const mobileMedia = resolveMedia(mobileImage) ?? resolveMedia(layers?.[layers.length - 1]?.image)
  const mobileImageUrl = mobileMedia?.url ? getMediaUrl(mobileMedia.url) : null
  const mobileAlign =
    mobileTextAlign === 'center' ? 'items-center text-center' : 'items-start text-left'
  const desktopHeightClass = DESKTOP_HEIGHT_CLASS[height ?? '600'] ?? DESKTOP_HEIGHT_CLASS['600']

  const renderCopy = (centerCta = false) => (
    <>
      {title && (
        <div className={titleClassName} style={{ color: resolvedTextColor }}>
          <RichText data={title} enableGutter={false} enableProse={false} />
        </div>
      )}

      {subtitle && (
        <div
          className={[subtitleClassName, centerCta ? '' : 'md:mb-8'].join(' ')}
          style={{ color: resolvedTextColor }}
        >
          <RichText data={subtitle} enableGutter={false} enableProse={false} />
        </div>
      )}

      {cta?.label &&
        cta?.url &&
        (centerCta ? (
          <div className="flex justify-center">
            <BtnNegro
              href={cta.url}
              target={cta.openInNewTab ? '_blank' : undefined}
              baseColor={cta.baseColor ?? undefined}
              fillColor={cta.fillColor ?? undefined}
              textColor={cta.textColor ?? undefined}
              hoverTextColor={cta.hoverTextColor ?? undefined}
            >
              {cta.label}
            </BtnNegro>
          </div>
        ) : (
          <BtnNegro
            href={cta.url}
            target={cta.openInNewTab ? '_blank' : undefined}
            baseColor={cta.baseColor ?? undefined}
            fillColor={cta.fillColor ?? undefined}
            textColor={cta.textColor ?? undefined}
            hoverTextColor={cta.hoverTextColor ?? undefined}
          >
            {cta.label}
          </BtnNegro>
        ))}
    </>
  )

  return (
    <section
      ref={heroRef}
      className={[
        // Cancel `<article className="pt-16">` so the hero sits flush under the navbar.
        'relative -mt-16 w-full overflow-hidden flex flex-col h-auto md:block',
        desktopHeightClass,
      ].join(' ')}
    >
      {/* Mobile: stacked — text block on top, full image below */}
      <div className="md:hidden flex flex-col">
        <div
          className={[
            'relative flex flex-col justify-center px-8 py-10 shrink-0',
            mobileAlign,
          ].join(' ')}
          style={{ background: resolvedMobileBgColor }}
        >
          {leftBgUrl && (
            <Image
              src={leftBgUrl}
              alt=""
              fill
              priority
              className="object-cover pointer-events-none select-none"
              sizes="100vw"
            />
          )}

          <div className="relative z-10 w-full">{renderCopy(mobileTextAlign === 'center')}</div>
        </div>

        {mobileImageUrl && (
          <div className="relative w-full shrink-0">
            <Image
              src={mobileImageUrl}
              alt={mobileMedia?.alt ?? ''}
              width={mobileMedia?.width ?? 1200}
              height={mobileMedia?.height ?? 800}
              priority
              className="h-auto w-full object-contain pointer-events-none select-none"
              sizes="100vw"
            />
          </div>
        )}
      </div>

      {/* Desktop: split layout with mousemove parallax */}
      {bgUrl && (
        <div className="hidden md:block absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          <div
            ref={backgroundRef}
            className="absolute will-change-transform"
            style={{
              inset: '-5px',
              transition: 'transform 0.1s ease-out',
            }}
          >
            <Image
              src={bgUrl}
              alt=""
              fill
              priority
              className="object-cover pointer-events-none select-none"
              sizes="100vw"
            />
          </div>
        </div>
      )}

      <div
        className="hidden md:block absolute inset-y-0 left-0 z-[1] overflow-hidden"
        style={{ width: 'min(50%, 680px)' }}
        aria-hidden={!!leftBgUrl}
      >
        {leftBgUrl && (
          <Image
            src={leftBgUrl}
            alt=""
            fill
            priority
            className="object-cover pointer-events-none select-none"
            sizes="50vw"
          />
        )}
      </div>

      <div
        className="hidden md:block absolute inset-0 z-[15] overflow-visible pointer-events-none"
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
              className="absolute top-[-6%] bottom-[-10%] left-[12%] right-[-3%] will-change-transform"
              style={{
                opacity: layer.opacity ?? 1,
                zIndex: index + 1,
                transition: 'transform 0.1s ease-out',
                minWidth: '850px',
                minHeight: '620px',
              }}
            >
              <div className="relative h-full w-full overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={layer.alt ?? ''}
                  fill
                  priority={index === 0}
                  draggable={false}
                  className="object-contain object-right pointer-events-none select-none"
                  sizes="760px"
                />
              </div>
            </div>
          )
        })}
      </div>

      <div
        className="hidden md:flex absolute inset-y-0 left-0 z-20 items-center pointer-events-none"
        style={{ width: 'min(50%, 680px)' }}
      >
        <div className="pointer-events-auto px-10 lg:px-16 max-w-xl">{renderCopy()}</div>
      </div>
    </section>
  )
}

export default HeroParallax3Hero
