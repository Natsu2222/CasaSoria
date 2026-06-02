'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import RichText from '@/components/RichText'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { useGoogleFont } from '@/utilities/useGoogleFont'

import styles from './CasosExitoGrids.module.css'

import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Media } from '@/payload-types'

type CaseItem = {
  id?: string | null
  image: Media | number
  imageAlt?: string | null
  company: string
  description?: DefaultTypedEditorState | null
  url?: string | null
  openInNewTab?: boolean | null
}

type CasosExitoGridsProps = {
  eyebrow?: DefaultTypedEditorState | null
  heading?: DefaultTypedEditorState | null
  cases?: CaseItem[] | null
  enableAnimation?: boolean | null
  animationDistance?: number | null
  animationDuration?: number | null
  headerFont?: string | null
  cardFont?: string | null
  sectionBackground?: string | null
  eyebrowColor?: string | null
  headingColor?: string | null
  companyColor?: string | null
  descriptionColor?: string | null
  blockType?: 'casosExitoGrids'
  className?: string
  disableInnerContainer?: boolean
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

function resolveImageUrl(image: Media | number): string | null {
  if (typeof image === 'object' && image !== null && 'url' in image) {
    return getMediaUrl(image.url, image.updatedAt) || null
  }
  return null
}

type CardProps = {
  image: Media | number
  imageAlt?: string | null
  company: string
  description?: DefaultTypedEditorState | null
  url?: string | null
  openInNewTab?: boolean | null
  direction: 'left' | 'right'
  distance: number
  duration: number
  enabled: boolean
  cardFont: string
  captionBackground: string
  accentColor: string
  companyColor: string
  descriptionColor: string
}

const CompanyName: React.FC<{
  company: string
  url?: string | null
  openInNewTab?: boolean | null
  accentColor: string
  companyColor: string
}> = ({ company, url, openInNewTab, accentColor, companyColor }) => {
  const content = (
    <span className={styles.companyRow}>
      <span
        aria-hidden="true"
        className={styles.accentLine}
        style={{ background: accentColor }}
      />
      <span className={styles.company} style={{ color: companyColor }}>
        {company}
      </span>
    </span>
  )

  if (url) {
    return (
      <Link
        href={url}
        target={openInNewTab ? '_blank' : undefined}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
        className="block no-underline"
      >
        {content}
      </Link>
    )
  }

  return content
}

const CaseCard: React.FC<CardProps> = ({
  image,
  imageAlt,
  company,
  description,
  url,
  openInNewTab,
  direction,
  distance,
  duration,
  enabled,
  cardFont,
  captionBackground,
  accentColor,
  companyColor,
  descriptionColor,
}) => {
  const cardRef = useRef<HTMLElement>(null)
  const imgUrl = resolveImageUrl(image)
  const alt = imageAlt ?? ''

  const initialX = direction === 'left' ? `-${distance}px` : `${distance}px`
  const transition = `opacity ${duration}ms ease, transform ${duration}ms ease`

  useEffect(() => {
    if (!enabled || !cardRef.current) return
    const el = cardRef.current
    const hiddenTransform = `translateX(${initialX})`

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transition = transition
          el.style.opacity = '1'
          el.style.transform = 'translateX(0)'
        } else {
          el.style.transition = 'none'
          el.style.opacity = '0'
          el.style.transform = hiddenTransform
          requestAnimationFrame(() => {
            el.style.transition = transition
          })
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [enabled, initialX, transition])

  const textContent = (
    <>
      <CompanyName
        company={company}
        url={url}
        openInNewTab={openInNewTab}
        accentColor={accentColor}
        companyColor={companyColor}
      />
      {hasRichText(description) && (
        <div
          className={`${styles.description} [&_*]:!text-inherit`}
          style={{ color: descriptionColor }}
        >
          <RichText data={description!} enableGutter={false} enableProse={false} />
        </div>
      )}
    </>
  )

  return (
    <article
      ref={cardRef}
      className={styles.card}
      style={{
        fontFamily: cardFont,
        ...(enabled
          ? {
              opacity: 0,
              transform: `translateX(${initialX})`,
              transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
            }
          : {}),
      }}
    >
      <div
        className={styles.cardLayout}
        style={{ ['--caption-bg' as string]: captionBackground }}
      >
        <div className={styles.mediaWrap}>
          {imgUrl && (
            <div className={styles.media}>
              {url ? (
                <Link
                  href={url}
                  target={openInNewTab ? '_blank' : undefined}
                  rel={openInNewTab ? 'noopener noreferrer' : undefined}
                  className="block h-full w-full"
                >
                  <Image
                    src={imgUrl}
                    alt={alt}
                    fill
                    sizes="570px"
                    className={styles.image}
                  />
                </Link>
              ) : (
                <Image
                  src={imgUrl}
                  alt={alt}
                  fill
                  sizes="570px"
                  className={styles.image}
                />
              )}
            </div>
          )}

          <div className={styles.textBlock}>{textContent}</div>
        </div>
      </div>
    </article>
  )
}

export const CasosExitoGridsBlock: React.FC<CasosExitoGridsProps> = ({
  eyebrow,
  heading,
  cases,
  enableAnimation = true,
  animationDistance = 60,
  animationDuration = 800,
  headerFont = 'Montserrat, sans-serif',
  cardFont = 'Montserrat, sans-serif',
  sectionBackground = '#ffffff',
  eyebrowColor = '#FFC950',
  headingColor = '#1e1e1c',
  companyColor = '#1e1e1c',
  descriptionColor = '#1e1e1c',
  className,
}) => {
  useGoogleFont(headerFont ?? undefined)
  useGoogleFont(cardFont ?? undefined)

  if (!cases?.length) return null

  const captionBg = sectionBackground ?? '#ffffff'

  return (
    <section
      className={[styles.section, 'py-16', className ?? ''].join(' ')}
      style={{ background: sectionBackground ?? undefined }}
    >
      <div className="container mx-auto px-4">
        <div className={styles.layout}>
        {(hasRichText(eyebrow) || hasRichText(heading)) && (
          <header
            className={styles.header}
            style={{ fontFamily: headerFont ?? undefined }}
          >
            {hasRichText(eyebrow) && (
              <div
                className="mb-3 flex items-center gap-4 text-xs font-bold uppercase tracking-[3px] [&_*]:!text-inherit"
                style={{ color: eyebrowColor ?? undefined }}
              >
                <span
                  aria-hidden="true"
                  className="block flex-shrink-0"
                  style={{ width: '54px', height: '2px', background: eyebrowColor ?? undefined }}
                />
                <RichText data={eyebrow!} enableGutter={false} enableProse={false} />
              </div>
            )}
            {hasRichText(heading) && (
              <div
                className="font-semibold leading-tight [&_*]:!text-inherit"
                style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: headingColor ?? undefined }}
              >
                <RichText data={heading!} enableGutter={false} enableProse={false} />
              </div>
            )}
          </header>
        )}

        <div className={styles.grid}>
          {cases.map((item, index) => {
            const direction: 'left' | 'right' = index % 2 === 0 ? 'left' : 'right'

            return (
              <CaseCard
                key={item.id ?? index}
                image={item.image}
                imageAlt={item.imageAlt}
                company={item.company}
                description={item.description}
                url={item.url}
                openInNewTab={item.openInNewTab}
                direction={direction}
                distance={animationDistance ?? 60}
                duration={animationDuration ?? 800}
                enabled={enableAnimation ?? true}
                cardFont={cardFont ?? 'Montserrat, sans-serif'}
                captionBackground={captionBg}
                accentColor={eyebrowColor ?? '#FFC950'}
                companyColor={companyColor ?? '#1e1e1c'}
                descriptionColor={descriptionColor ?? '#1e1e1c'}
              />
            )
          })}
        </div>
        </div>
      </div>
    </section>
  )
}
