'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import RichText from '@/components/RichText'
import { BtnNegro } from '@/components/BtnNegro'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { useGoogleFont } from '@/utilities/useGoogleFont'
import { cn } from '@/utilities/ui'

import styles from './LayoutSupport.module.css'

import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Media } from '@/payload-types'

type LayoutSupportProps = {
  imagePosition?: 'left' | 'right' | null
  image: Media | number
  imageAlt?: string | null
  eyebrow?: DefaultTypedEditorState | null
  heading?: DefaultTypedEditorState | null
  body?: DefaultTypedEditorState | null
  cta?: {
    label?: string | null
    url?: string | null
    openInNewTab?: boolean | null
  } | null
  eyebrowFont?: string | null
  headingFont?: string | null
  bodyFont?: string | null
  backgroundType?: 'image' | 'color' | null
  backgroundImage?: Media | number | null
  backgroundPosition?: string | null
  backgroundColor?: string | null
  overlayColor?: string | null
  paddingY?: string | null
  eyebrowColor?: string | null
  headingColor?: string | null
  bodyColor?: string | null
  imagePulseColor?: string | null
  enableFadeIn?: boolean | null
  blockType?: 'layoutSupport'
  className?: string
  disableInnerContainer?: boolean
}

function resolveMediaUrl(field: unknown): string | null {
  const media = typeof field === 'object' && field !== null ? (field as Media) : null
  const url = media?.url ? getMediaUrl(media.url) : null
  return url || null
}

function hasRichText(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const root = (value as { root?: { children?: unknown[] } }).root
  if (!root?.children?.length) return false
  return root.children.some((node) => {
    const n = node as { children?: unknown[]; text?: string }
    return (n.text ?? '') !== '' || (n.children?.length ?? 0) > 0
  })
}

export const LayoutSupportBlock: React.FC<LayoutSupportProps> = ({
  imagePosition = 'left',
  image,
  imageAlt,
  eyebrow,
  heading,
  body,
  cta,
  eyebrowFont = 'Montserrat, sans-serif',
  headingFont = 'Montserrat, sans-serif',
  bodyFont = 'Montserrat, sans-serif',
  backgroundType = 'image',
  backgroundImage,
  backgroundPosition = 'right center',
  backgroundColor = '#ffffff',
  overlayColor,
  paddingY = '160',
  eyebrowColor = '#1e1e1c',
  headingColor = '#1e1e1c',
  bodyColor = '#f3f3f3',
  imagePulseColor = '#FFC950',
  enableFadeIn = true,
  className,
}) => {
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const imgUrl = resolveMediaUrl(image)
  const bgImgUrl = resolveMediaUrl(backgroundImage)

  useGoogleFont(eyebrowFont ?? undefined)
  useGoogleFont(headingFont ?? undefined)
  useGoogleFont(bodyFont ?? undefined)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        // Reinicia animaciones cuando el bloque sale casi por completo y vuelve a entrar
        setInView(entry.isIntersecting && entry.intersectionRatio >= 0.2)
      },
      { threshold: [0, 0.2, 0.35, 0.5, 0.65] },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const sectionStyle: React.CSSProperties = {
    paddingTop: `${paddingY}px`,
    paddingBottom: `${paddingY}px`,
    position: 'relative',
    overflow: 'hidden',
    ...(backgroundType === 'color' || !bgImgUrl
      ? { background: backgroundColor ?? '#ffffff' }
      : {}),
  }

  const bgObjectPosition = backgroundPosition ?? 'right center'
  const imgOrder = imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1'
  const txtOrder = imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2'
  const slideClass = imagePosition === 'left' ? styles.slideFromRight : styles.slideFromLeft
  const pulseDisabled = !imagePulseColor || imagePulseColor === 'transparent'

  return (
    <section
      ref={sectionRef}
      style={sectionStyle}
      className={cn(styles.section, className)}
    >
      {backgroundType === 'image' && bgImgUrl && (
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          <Image
            src={bgImgUrl}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: bgObjectPosition }}
          />
        </div>
      )}

      {backgroundType === 'image' && overlayColor && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{ background: overlayColor }}
        />
      )}

      <div className="container relative z-[2] mx-auto px-4">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
          <div className={cn('w-full lg:w-1/2', imgOrder)}>
            {imgUrl && (
              <div
                className={cn(
                  styles.imgOuter,
                  !pulseDisabled && inView && styles.imgOuterPulse,
                )}
                style={
                  !pulseDisabled
                    ? ({ '--pulse-color': imagePulseColor ?? '#FFC950' } as React.CSSProperties)
                    : undefined
                }
              >
                <div className={cn(styles.imgWrap, inView && styles.imgWrapInView)}>
                  <Image
                    src={imgUrl}
                    alt={imageAlt ?? ''}
                    width={600}
                    height={600}
                    loading="lazy"
                    className={styles.img}
                  />
                </div>
              </div>
            )}
          </div>

          <div
            className={cn(
              'w-full lg:w-1/2',
              txtOrder,
              enableFadeIn ? styles.textBlock : styles.textBlockStatic,
              enableFadeIn && slideClass,
              enableFadeIn && inView && styles.textBlockInView,
            )}
          >
            {hasRichText(eyebrow) && (
              <div
                className="mb-4 text-xs font-bold uppercase tracking-[3px] [&_*]:!text-inherit"
                style={{ color: eyebrowColor ?? undefined, fontFamily: eyebrowFont ?? undefined }}
              >
                <RichText data={eyebrow!} enableGutter={false} enableProse={false} />
              </div>
            )}

            {hasRichText(heading) && (
              <div
                className="mb-6 font-semibold leading-tight [&_*]:!text-inherit"
                style={{
                  fontSize: 'clamp(28px, 4vw, 40px)',
                  color: headingColor ?? undefined,
                  fontFamily: headingFont ?? undefined,
                }}
              >
                <RichText data={heading!} enableGutter={false} enableProse={false} />
              </div>
            )}

            {hasRichText(body) && (
              <div
                className="mb-10 leading-relaxed [&_*]:!text-inherit"
                style={{
                  fontSize: '15px',
                  color: bodyColor ?? undefined,
                  fontFamily: bodyFont ?? undefined,
                }}
              >
                <RichText data={body!} enableGutter={false} enableProse={false} />
              </div>
            )}

            {cta?.label && cta?.url && (
              <BtnNegro href={cta.url} target={cta.openInNewTab ? '_blank' : undefined}>
                {cta.label}
              </BtnNegro>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default LayoutSupportBlock
