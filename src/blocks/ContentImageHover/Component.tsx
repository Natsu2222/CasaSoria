'use client'

import React from 'react'
import Image from 'next/image'

import RichText from '@/components/RichText'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { useGoogleFont } from '@/utilities/useGoogleFont'
import { cn } from '@/utilities/ui'

import styles from './ContentImageHover.module.css'

import type { ContentImageHoverBlock as ContentImageHoverBlockData, Media } from '@/payload-types'

type Props = ContentImageHoverBlockData & {
  className?: string
  disableInnerContainer?: boolean
}

function resolveMediaUrl(field: unknown): string | null {
  if (typeof field !== 'object' || field === null) return null
  const media = field as Media
  return media.url ? getMediaUrl(media.url, media.updatedAt) : null
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

export const ContentImageHoverBlock: React.FC<Props> = ({
  imagePosition = 'right',
  baseImage,
  baseImageAlt,
  topImage,
  topImageAlt,
  hoverScale = '1.1',
  hoverDuration = '600',
  heading,
  subheading,
  description,
  headingFont = 'Montserrat, sans-serif',
  subheadingFont = 'Montserrat, sans-serif',
  descriptionFont = 'Montserrat, sans-serif',
  headingColor = '#1e1e1c',
  subheadingColor = '#1e1e1c',
  descriptionColor = '#1e1e1c',
  backgroundColor = '#f3f3f3',
  paddingY = '120',
  className,
}) => {
  useGoogleFont(headingFont ?? undefined)
  useGoogleFont(subheadingFont ?? undefined)
  useGoogleFont(descriptionFont ?? undefined)

  const baseUrl = resolveMediaUrl(baseImage)
  const topUrl = resolveMediaUrl(topImage)

  const imgOrder = imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1'
  const txtOrder = imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2'

  const stackStyle = {
    '--hover-scale': hoverScale ?? '1.1',
    '--hover-duration': `${hoverDuration ?? '600'}ms`,
  } as React.CSSProperties

  return (
    <section
      className={cn(styles.section, className)}
      style={{
        backgroundColor: backgroundColor ?? '#f3f3f3',
        paddingTop: `${paddingY}px`,
        paddingBottom: `${paddingY}px`,
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
          <div className={cn('w-full lg:w-1/2', txtOrder, styles.textBlock)}>
            {hasRichText(heading) && (
              <div
                className="mb-4 font-semibold leading-tight [&_*]:!text-inherit"
                style={{
                  fontSize: 'clamp(28px, 4vw, 42px)',
                  color: headingColor ?? undefined,
                  fontFamily: headingFont ?? undefined,
                }}
              >
                <RichText data={heading!} enableGutter={false} enableProse={false} />
              </div>
            )}

            {hasRichText(subheading) && (
              <div
                className="mb-6 font-semibold leading-snug [&_*]:!text-inherit"
                style={{
                  fontSize: 'clamp(20px, 2.5vw, 28px)',
                  color: subheadingColor ?? undefined,
                  fontFamily: subheadingFont ?? undefined,
                }}
              >
                <RichText data={subheading!} enableGutter={false} enableProse={false} />
              </div>
            )}

            {hasRichText(description) && (
              <div
                className="leading-relaxed [&_*]:!text-inherit [&_a]:underline"
                style={{
                  fontSize: '15px',
                  color: descriptionColor ?? undefined,
                  fontFamily: descriptionFont ?? undefined,
                }}
              >
                <RichText data={description!} enableGutter={false} enableProse={false} />
              </div>
            )}
          </div>

          <div className={cn('w-full overflow-visible lg:w-1/2', imgOrder)}>
            {baseUrl && topUrl && (
              <div className={styles.imageStack} style={stackStyle}>
                <div className={styles.baseWrap}>
                  <Image
                    src={baseUrl}
                    alt={baseImageAlt ?? ''}
                    width={800}
                    height={600}
                    loading="lazy"
                    className={styles.baseImage}
                  />
                </div>
                <div className={styles.topWrap}>
                  <Image
                    src={topUrl}
                    alt={topImageAlt ?? ''}
                    width={800}
                    height={600}
                    loading="lazy"
                    className={styles.topImage}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContentImageHoverBlock
