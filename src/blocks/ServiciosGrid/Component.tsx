'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import RichText from '@/components/RichText'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { useGoogleFont } from '@/utilities/useGoogleFont'

import styles from './ServiciosGrid.module.css'

import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Media } from '@/payload-types'

type ServiceItem = {
  id?: string | null
  icon: Media | number
  title?: DefaultTypedEditorState | null
  description?: DefaultTypedEditorState | null
  hideDescriptionUntilHover?: boolean | null
  url?: string | null
  openInNewTab?: boolean | null
}

type ServicesGridProps = {
  eyebrow?: DefaultTypedEditorState | null
  heading?: DefaultTypedEditorState | null
  headerFont?: string | null
  eyebrowColor?: string | null
  headingColor?: string | null
  backgroundColor?: string | null
  services?: ServiceItem[] | null
  cardFont?: string | null
  cardBackground?: string | null
  textColorRest?: string | null
  accentColor?: string | null
  hoverFillColor?: string | null
  textColorHover?: string | null
  accentColorHover?: string | null
  blockType?: 'servicesGrid'
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

function resolveIconUrl(icon: unknown): string | null {
  const media = typeof icon === 'object' && icon !== null ? (icon as Media) : null
  const url = media?.url ? getMediaUrl(media.url) : null
  return url || null
}

type CardProps = {
  icon: unknown
  title: DefaultTypedEditorState | null | undefined
  description: DefaultTypedEditorState | null | undefined
  hideDescriptionUntilHover?: boolean | null
  url?: string | null
  openInNewTab?: boolean | null
  cardBackground: string
  hoverFillColor: string
  textColorRest: string
  textColorHover: string
  accentColor: string
  accentColorHover: string
  cardFont: string
}

const ServiceCard: React.FC<CardProps> = ({
  icon,
  title,
  description,
  hideDescriptionUntilHover,
  url,
  openInNewTab,
  cardBackground,
  hoverFillColor,
  textColorRest,
  textColorHover,
  accentColor,
  accentColorHover,
  cardFont,
}) => {
  const iconUrl = resolveIconUrl(icon)

  return (
    <div
      className={`${styles.card} services-card flex h-full min-h-[320px] flex-col`}
      style={{
        background: cardBackground,
        fontFamily: cardFont,
        ['--txt-rest' as string]: textColorRest,
        ['--txt-hover' as string]: textColorHover,
        ['--accent' as string]: accentColor,
        ['--accent-hover' as string]: accentColorHover,
        ['--fill' as string]: hoverFillColor,
      }}
    >
      <div aria-hidden="true" className={styles.fill} />

      <div
        className={`${styles.content} content-inner flex flex-1 flex-col items-center justify-center px-8 py-10 text-center`}
      >
        {iconUrl && (
          <div className="mb-6 flex shrink-0 justify-center">
            <Image src={iconUrl} alt="" width={72} height={72} className="object-contain" />
          </div>
        )}

        {hasRichText(title) && (
          <div
            className={`${styles.cardText} mb-4 max-w-[280px] font-bold leading-snug [&_*]:text-inherit`}
            style={{ fontSize: '22px' }}
          >
            {url ? (
              <Link
                href={url}
                target={openInNewTab ? '_blank' : undefined}
                rel={openInNewTab ? 'noopener noreferrer' : undefined}
              >
                <RichText data={title!} enableGutter={false} enableProse={false} />
              </Link>
            ) : (
              <RichText data={title!} enableGutter={false} enableProse={false} />
            )}
          </div>
        )}

        {hasRichText(description) && (
          <div
            className={[
              styles.cardText,
              'description-text max-w-[300px] text-sm leading-relaxed [&_*]:text-inherit',
              hideDescriptionUntilHover ? styles.descriptionUntilHover : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <RichText data={description!} enableGutter={false} enableProse={false} />
          </div>
        )}
      </div>

      <div aria-hidden="true" className={styles.accentBase} />
      <div aria-hidden="true" className={styles.accentHover} />
    </div>
  )
}

export const ServicesGridBlock: React.FC<ServicesGridProps> = ({
  eyebrow,
  heading,
  headerFont = 'Montserrat, sans-serif',
  eyebrowColor = '#FFC950',
  headingColor = '#1e1e1c',
  backgroundColor = '#ffffff',
  services,
  cardFont = 'Montserrat, sans-serif',
  cardBackground = '#f3f3f3',
  textColorRest = '#1e1e1c',
  accentColor = '#FFC950',
  hoverFillColor = '#FFC950',
  textColorHover = '#1e1e1c',
  accentColorHover = '#f3f3f3',
  className,
}) => {
  useGoogleFont(headerFont ?? undefined)
  useGoogleFont(cardFont ?? undefined)

  if (!services?.length) return null

  const colClass =
    services.length <= 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : services.length === 4
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <section
      className={['py-12 lg:py-16', className ?? ''].join(' ')}
      style={{ backgroundColor: backgroundColor ?? '#ffffff' }}
    >
      <div className="container mx-auto px-4">
        {(hasRichText(eyebrow) || hasRichText(heading)) && (
          <header className="mb-10 lg:mb-12" style={{ fontFamily: headerFont ?? undefined }}>
            {hasRichText(eyebrow) && (
              <div className="mb-3 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="inline-block shrink-0"
                  style={{
                    width: '32px',
                    height: '3px',
                    backgroundColor: eyebrowColor ?? accentColor ?? '#FFC950',
                  }}
                />
                <div
                  className="text-xs font-bold uppercase tracking-[3px] [&_*]:text-inherit"
                  style={{ color: headingColor ?? undefined }}
                >
                  <RichText data={eyebrow!} enableGutter={false} enableProse={false} />
                </div>
              </div>
            )}
            {hasRichText(heading) && (
              <div
                className="font-semibold leading-tight [&_*]:text-inherit"
                style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: headingColor ?? undefined }}
              >
                <RichText data={heading!} enableGutter={false} enableProse={false} />
              </div>
            )}
          </header>
        )}

        <div className={`grid gap-6 lg:gap-8 ${colClass}`}>
          {services.map((service, index) => (
            <ServiceCard
              key={service.id ?? index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              hideDescriptionUntilHover={service.hideDescriptionUntilHover}
              url={service.url}
              openInNewTab={service.openInNewTab}
              cardBackground={cardBackground ?? '#f3f3f3'}
              hoverFillColor={hoverFillColor ?? '#FFC950'}
              textColorRest={textColorRest ?? '#1e1e1c'}
              textColorHover={textColorHover ?? '#1e1e1c'}
              accentColor={accentColor ?? '#FFC950'}
              accentColorHover={accentColorHover ?? '#f3f3f3'}
              cardFont={cardFont ?? 'Montserrat, sans-serif'}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesGridBlock
