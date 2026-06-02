'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import RichText from '@/components/RichText'
import { BtnNegro } from '@/components/BtnNegro'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { useGoogleFont } from '@/utilities/useGoogleFont'
import { cn } from '@/utilities/ui'

import styles from './CTAParallax.module.css'

import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Media } from '@/payload-types'

const PARALLAX_SPEED = 0.35

type CtaParallaxProps = {
  heading?: DefaultTypedEditorState | null
  cta?: {
    label?: string | null
    url?: string | null
    openInNewTab?: boolean | null
  } | null
  backgroundImage: Media | number
  backgroundPosition?: 'center center' | 'center top' | 'center bottom' | 'left center' | 'right center' | null
  overlayColor?: string | null
  disableParallaxOnTouch?: boolean | null
  textColumns?: '9' | '8' | '6' | null
  paddingY?: '60' | '90' | '120' | '160' | null
  headingFont?: string | null
  headingSize?: '30' | '36' | '40' | '45' | '50' | null
  headingColor?: string | null
  buttonFillColor?: string | null
  blockType?: 'ctaParallax'
  className?: string
  disableInnerContainer?: boolean
}

function resolveBackgroundUrl(image: Media | number | null | undefined): string | null {
  if (!image || typeof image === 'number') return null
  return image.url ? getMediaUrl(image.url, image.updatedAt) : null
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

function colWidths(cols: string): [string, string] {
  const map: Record<string, [string, string]> = {
    '9': ['w-full md:w-2/3 lg:w-3/4', 'w-full md:w-1/3 lg:w-1/4'],
    '8': ['w-full md:w-2/3', 'w-full md:w-1/3'],
    '6': ['w-full md:w-1/2', 'w-full md:w-1/2'],
  }
  return map[cols] ?? map['9']
}

export const CtaParallaxBlock: React.FC<CtaParallaxProps> = ({
  heading,
  cta,
  backgroundImage,
  backgroundPosition = 'center center',
  overlayColor,
  disableParallaxOnTouch = true,
  textColumns = '9',
  paddingY = '90',
  headingFont = 'Montserrat, sans-serif',
  headingSize = '40',
  headingColor = '#1e1e1c',
  buttonFillColor = '#f3f3f3',
  className,
}) => {
  useGoogleFont(headingFont ?? undefined)

  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const [parallaxEnabled, setParallaxEnabled] = useState(false)

  const bgUrl = resolveBackgroundUrl(backgroundImage)
  const [textW, btnW] = colWidths(textColumns ?? '9')
  const objectPosition = backgroundPosition ?? 'center center'

  useEffect(() => {
    if (disableParallaxOnTouch && window.matchMedia('(hover: none)').matches) {
      setParallaxEnabled(false)
      return
    }
    setParallaxEnabled(true)
  }, [disableParallaxOnTouch])

  const setBgTransform = useCallback(
    (offsetY = 0) => {
      if (!bgRef.current) return
      bgRef.current.style.transform =
        offsetY === 0 ? 'translateX(-50%)' : `translate3d(-50%, ${offsetY}px, 0)`
    },
    [],
  )

  const handleScroll = useCallback(() => {
    if (!parallaxEnabled || !sectionRef.current) return
    const offset = -sectionRef.current.getBoundingClientRect().top * PARALLAX_SPEED
    setBgTransform(offset)
  }, [parallaxEnabled, setBgTransform])

  useEffect(() => {
    if (!parallaxEnabled) {
      setBgTransform(0)
      return
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [handleScroll, parallaxEnabled, setBgTransform])

  return (
    <section
      ref={sectionRef}
      className={cn(styles.section, className)}
    >
      {bgUrl && (
        <div className={styles.bgClip} aria-hidden="true">
          <div
            ref={bgRef}
            className={cn(styles.bgLayer, parallaxEnabled && styles.bgLayerParallax)}
          >
            <Image
              src={bgUrl}
              alt=""
              fill
              sizes="100vw"
              className={styles.bgImage}
              style={{ objectPosition }}
            />
          </div>
        </div>
      )}

      {overlayColor && (
        <div className={styles.overlay} aria-hidden="true" style={{ background: overlayColor }} />
      )}

      <div
        className={cn(styles.content, 'container mx-auto px-4')}
        style={{
          paddingTop: `${paddingY}px`,
          paddingBottom: `${paddingY}px`,
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {hasRichText(heading) && (
            <div
              className={`
                ${textW}
                text-center md:text-left
                font-semibold leading-tight
                [&_*]:!text-inherit
              `}
              style={{
                fontSize: `clamp(28px, 4vw, ${headingSize}px)`,
                color: headingColor ?? undefined,
                fontFamily: headingFont ?? undefined,
              }}
            >
              <RichText data={heading} />
            </div>
          )}

          {cta?.label && cta?.url && (
            <div className={`${btnW} flex justify-center md:justify-end`}>
              <BtnNegro
                href={cta.url}
                target={cta.openInNewTab ? '_blank' : undefined}
                fillColor={buttonFillColor ?? undefined}
              >
                {cta.label}
              </BtnNegro>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
