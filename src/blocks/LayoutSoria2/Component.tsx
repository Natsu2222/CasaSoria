import React from 'react'

import type { LayoutSoria2Block as LayoutSoria2BlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

import { ScrollReveal } from './ScrollReveal'
import { LayoutSoria2TextColumn } from './TextColumn'

function sanitizeAnchorId(value: string | null | undefined): string | undefined {
  const s = (value || '').trim().replace(/[^a-zA-Z0-9_-]/g, '')
  return s || undefined
}

function pxRadius(value: unknown, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback
  return Math.min(28, Math.max(8, Math.round(value)))
}

export const LayoutSoria2Block: React.FC<
  LayoutSoria2BlockProps & { disableInnerContainer?: boolean }
> = (props) => {
  const {
    anchorId,
    heading,
    description,
    stats,
    image,
    imageAlt,
    imagePosition,
    backgroundColor,
    headingColor,
    descriptionColor,
    statCardBackground,
    statNumberColor,
    statLabelColor,
    cornerRadius,
    fontFamily,
    disableInnerContainer,
  } = props

  const id = sanitizeAnchorId(anchorId)
  const bg = (backgroundColor || '#1a1a1a').trim() || '#1a1a1a'
  const hColor = (headingColor || '#ffffff').trim() || '#ffffff'
  const dColor = (descriptionColor || '#f5f5f5').trim() || '#f5f5f5'
  const cardBg = (statCardBackground || '#ffffff').trim() || '#ffffff'
  const numColor = (statNumberColor || '#0a0a0a').trim() || '#0a0a0a'
  const lblColor = (statLabelColor || '#404040').trim() || '#404040'
  const radius = pxRadius(cornerRadius, 16)
  const radiusStyle = { borderRadius: `${radius}px` }

  const imageOnRight = imagePosition !== 'left'

  const resolvedImageAlt =
    (imageAlt && imageAlt.trim()) ||
    (typeof image === 'object' && image?.alt?.trim ? image.alt.trim() : '') ||
    ''

  return (
    <section
      id={id}
      className="w-full py-14 md:py-20 lg:py-24"
      style={{ backgroundColor: bg }}
    >
      <div
        className={cn(
          'mx-auto w-full max-w-7xl px-[5%] md:px-8 lg:px-12',
          !disableInnerContainer && 'container',
        )}
      >
        <div
          className={cn(
            'grid grid-cols-1 items-center gap-12 lg:gap-16 xl:gap-20',
            'lg:grid-cols-2',
          )}
        >
          <LayoutSoria2TextColumn
            className={imageOnRight ? 'lg:order-1' : 'lg:order-2'}
            heading={heading}
            description={description}
            stats={stats}
            fontFamily={fontFamily}
            headingColor={hColor}
            descriptionColor={dColor}
            statCardBackground={cardBg}
            statNumberColor={numColor}
            statLabelColor={lblColor}
            radiusStyle={radiusStyle}
          />

          <ScrollReveal
            className={cn(
              'w-full min-w-0',
              imageOnRight ? 'lg:order-2' : 'lg:order-1',
            )}
            delayMs={480}
          >
            <div
              className="relative isolate min-h-[280px] w-full overflow-hidden lg:min-h-[420px]"
              style={radiusStyle}
            >
              {image && typeof image === 'object' ? (
                <Media
                  fill
                  resource={image}
                  alt={resolvedImageAlt || undefined}
                  imgClassName="object-cover"
                />
              ) : null}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
