'use client'

import React, { useId } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import RichText from '@/components/RichText'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { useGoogleFont } from '@/utilities/useGoogleFont'

import type { FlexContentBlock as FlexContentBlockData, Media } from '@/payload-types'

type Props = FlexContentBlockData & { className?: string }

function resolveUrl(field: unknown): string | null {
  if (typeof field !== 'object' || field === null) return null
  const image = field as Media
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

function colClasses(pct: string): { img: string; txt: string } {
  const map: Record<string, { img: string; txt: string }> = {
    '25': { img: 'md:w-1/4', txt: 'md:w-3/4' },
    '33': { img: 'md:w-1/3', txt: 'md:w-2/3' },
    '40': { img: 'md:w-2/5', txt: 'md:w-3/5' },
    '50': { img: 'md:w-1/2', txt: 'md:w-1/2' },
    '60': { img: 'md:w-3/5', txt: 'md:w-2/5' },
    '66': { img: 'md:w-2/3', txt: 'md:w-1/3' },
    '75': { img: 'md:w-3/4', txt: 'md:w-1/4' },
  }
  return map[pct] ?? map['50']
}

type ImageBlockProps = {
  url: string
  alt: string
  objectFit: string
  rounded: boolean
  secondUrl?: string | null
  secondAlt?: string | null
}

const ImageBlock: React.FC<ImageBlockProps> = ({
  url,
  alt,
  objectFit,
  rounded,
  secondUrl,
  secondAlt,
}) => (
  <div className="flex flex-col gap-4 w-full">
    <div className={['overflow-hidden w-full', rounded ? 'rounded-lg' : ''].join(' ')}>
      <Image
        src={url}
        alt={alt}
        width={900}
        height={600}
        loading="lazy"
        className={[
          'w-full h-auto block',
          objectFit === 'cover' ? 'object-cover' : 'object-contain',
        ].join(' ')}
      />
    </div>
    {secondUrl && (
      <div className={['overflow-hidden w-full', rounded ? 'rounded-lg' : ''].join(' ')}>
        <Image
          src={secondUrl}
          alt={secondAlt ?? ''}
          width={900}
          height={600}
          loading="lazy"
          className={[
            'w-full h-auto block',
            objectFit === 'cover' ? 'object-cover' : 'object-contain',
          ].join(' ')}
        />
      </div>
    )}
  </div>
)

type TextBlockProps = {
  eyebrow: unknown
  heading: unknown
  subheading: unknown
  body: unknown
  textAlign: string
  headingFont: string
  bodyFont: string
  headingSize: string
  subheadingSize: string
  eyebrowColor: string
  eyebrowLineColor: string
  headingColor: string
  subheadingColor: string
  bodyColor: string
  ctaLabel?: string | null
  ctaUrl?: string | null
  ctaOpenInNewTab?: boolean | null
  ctaStyle?: string | null
  buttonFillColor?: string | null
  buttonTextColor?: string | null
  buttonBorderColor?: string | null
  uid: string
}

const TextBlock: React.FC<TextBlockProps> = ({
  eyebrow,
  heading,
  subheading,
  body,
  textAlign,
  headingFont,
  bodyFont,
  headingSize,
  subheadingSize,
  eyebrowColor,
  eyebrowLineColor,
  headingColor,
  subheadingColor,
  bodyColor,
  ctaLabel,
  ctaUrl,
  ctaOpenInNewTab,
  ctaStyle,
  buttonFillColor,
  buttonTextColor,
  buttonBorderColor,
  uid,
}) => {
  const alignClass =
    textAlign === 'center' ? 'text-center' : textAlign === 'right' ? 'text-right' : 'text-left'

  return (
    <div className={`flex flex-col ${alignClass}`}>
      {hasRichText(eyebrow) && (
        <div
          className={`flex items-center gap-4 mb-3 text-xs font-bold uppercase tracking-[3px] [&_*]:!text-inherit ${
            textAlign === 'center' ? 'justify-center' : textAlign === 'right' ? 'justify-end' : ''
          }`}
          style={{ color: eyebrowColor }}
        >
          {textAlign !== 'center' && textAlign !== 'right' && (
            <span
              aria-hidden="true"
              className="flex-shrink-0 block"
              style={{ width: '54px', height: '2px', background: eyebrowLineColor }}
            />
          )}
          <RichText data={eyebrow as Parameters<typeof RichText>[0]['data']} />
        </div>
      )}

      {hasRichText(heading) && (
        <div
          className="font-semibold leading-tight mb-4 [&_*]:!text-inherit"
          style={{
            fontSize: `clamp(24px, 3vw, ${headingSize}px)`,
            color: headingColor,
            fontFamily: headingFont,
          }}
        >
          <RichText data={heading as Parameters<typeof RichText>[0]['data']} />
        </div>
      )}

      {hasRichText(subheading) && (
        <div
          className="font-semibold leading-snug mb-4 [&_*]:!text-inherit"
          style={{
            fontSize: `clamp(18px, 2vw, ${subheadingSize}px)`,
            color: subheadingColor,
            fontFamily: headingFont,
          }}
        >
          <RichText data={subheading as Parameters<typeof RichText>[0]['data']} />
        </div>
      )}

      {hasRichText(body) && (
        <div
          className="leading-relaxed [&_*]:!text-inherit [&_a]:underline"
          style={{
            color: bodyColor,
            fontFamily: bodyFont,
          }}
        >
          <RichText data={body as Parameters<typeof RichText>[0]['data']} />
        </div>
      )}

      {ctaLabel && ctaUrl && (
        <div className={`mt-8 ${textAlign === 'center' ? 'flex justify-center' : ''}`}>
          {ctaStyle === 'animatedLine' ? (
            <>
              <style>{`
                .fc-cta-link-${uid} {
                  position: relative;
                  display: inline-block;
                  color: ${buttonTextColor ?? headingColor};
                  text-decoration: none;
                  font-weight: 700;
                  transition: color 300ms ease;
                }
                .fc-cta-link-${uid}::after {
                  content: '';
                  position: absolute;
                  bottom: -2px;
                  left: 50%;
                  right: 50%;
                  height: 1px;
                  background: ${buttonFillColor ?? eyebrowColor};
                  transition: left 300ms ease, right 300ms ease;
                }
                .fc-cta-link-${uid}:hover::after { left: 0; right: 0; }
              `}</style>
              <Link
                href={ctaUrl}
                target={ctaOpenInNewTab ? '_blank' : undefined}
                rel={ctaOpenInNewTab ? 'noopener noreferrer' : undefined}
                className={`fc-cta-link-${uid} font-bold`}
              >
                {ctaLabel}
              </Link>
            </>
          ) : (
            <>
              <style>{`
                .fc-btn-${uid} {
                  position: relative;
                  display: inline-block;
                  overflow: hidden;
                  padding: 14px 32px;
                  border: 2px solid ${buttonBorderColor ?? '#1e1e1c'};
                  color: ${buttonTextColor ?? '#ffffff'};
                  background: ${buttonBorderColor ?? '#1e1e1c'};
                  font-weight: 700;
                  font-size: 13px;
                  letter-spacing: 1.5px;
                  text-transform: uppercase;
                  text-decoration: none;
                  cursor: pointer;
                  z-index: 0;
                  transition: color 400ms cubic-bezier(0.5,1.6,0.4,0.7);
                }
                .fc-btn-${uid}::before {
                  content: '';
                  position: absolute;
                  inset: 0;
                  background: ${buttonFillColor ?? '#f3f3f3'};
                  transform: scaleX(0);
                  transform-origin: left center;
                  transition: transform 400ms cubic-bezier(0.5,1.6,0.4,0.7);
                  z-index: -1;
                }
                .fc-btn-${uid}:hover { color: ${buttonBorderColor ?? '#1e1e1c'}; }
                .fc-btn-${uid}:hover::before { transform: scaleX(1); }
              `}</style>
              <Link
                href={ctaUrl}
                target={ctaOpenInNewTab ? '_blank' : undefined}
                rel={ctaOpenInNewTab ? 'noopener noreferrer' : undefined}
                className={`fc-btn-${uid}`}
              >
                {ctaLabel}
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export const FlexContentBlock: React.FC<Props> = ({
  eyebrow,
  heading,
  subheading,
  body,
  ctaLabel,
  ctaUrl,
  ctaOpenInNewTab = false,
  ctaStyle = 'btnNegro',
  buttonFillColor = '#f3f3f3',
  buttonTextColor = '#ffffff',
  buttonBorderColor = '#1e1e1c',
  image,
  imageAlt,
  imagePosition = 'right',
  imageWidthPercent = '50',
  imageVerticalAlign = 'center',
  imageObjectFit = 'cover',
  imageRounded = false,
  secondImage,
  secondImageAlt,
  backgroundType = 'color',
  backgroundColor = '#ffffff',
  backgroundImage,
  backgroundPosition = 'center center',
  overlayColor,
  paddingTop = '80',
  paddingBottom = '80',
  textAlign = 'left',
  verticalAlign = 'center',
  columnGap = '48',
  headingFont = 'Montserrat, sans-serif',
  bodyFont = 'Montserrat, sans-serif',
  headingSize = '36',
  subheadingSize = '22',
  eyebrowColor = '#FFC950',
  eyebrowLineColor = '#FFC950',
  headingColor = '#1e1e1c',
  subheadingColor = '#1e1e1c',
  bodyColor = '#1e1e1c',
  className,
}) => {
  const uid = useId().replace(/:/g, '')

  useGoogleFont(headingFont ?? undefined)
  useGoogleFont(bodyFont ?? undefined)

  const imgUrl = resolveUrl(image)
  const secondImgUrl = resolveUrl(secondImage)
  const bgImgUrl = resolveUrl(backgroundImage)

  const hasContent =
    hasRichText(eyebrow) ||
    hasRichText(heading) ||
    hasRichText(subheading) ||
    hasRichText(body) ||
    (ctaLabel && ctaUrl)

  if (!hasContent && !imgUrl) return null

  const bgStyle: React.CSSProperties =
    backgroundType === 'image' && bgImgUrl
      ? {
          backgroundImage: `url(${bgImgUrl})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: backgroundPosition ?? 'center center',
        }
      : { backgroundColor: backgroundColor ?? '#ffffff' }

  const { img: imgColClass, txt: txtColClass } = colClasses(imageWidthPercent ?? '50')

  const vAlignClass =
    verticalAlign === 'start'
      ? 'items-start'
      : verticalAlign === 'end'
        ? 'items-end'
        : 'items-center'

  const textProps: TextBlockProps = {
    eyebrow,
    heading,
    subheading,
    body,
    textAlign: textAlign ?? 'left',
    headingFont: headingFont ?? 'Montserrat, sans-serif',
    bodyFont: bodyFont ?? 'Montserrat, sans-serif',
    headingSize: headingSize ?? '36',
    subheadingSize: subheadingSize ?? '22',
    eyebrowColor: eyebrowColor ?? '#FFC950',
    eyebrowLineColor: eyebrowLineColor ?? '#FFC950',
    headingColor: headingColor ?? '#1e1e1c',
    subheadingColor: subheadingColor ?? '#1e1e1c',
    bodyColor: bodyColor ?? '#1e1e1c',
    ctaLabel,
    ctaUrl,
    ctaOpenInNewTab,
    ctaStyle,
    buttonFillColor,
    buttonTextColor,
    buttonBorderColor,
    uid,
  }

  const imageBlock = imgUrl ? (
    <ImageBlock
      url={imgUrl}
      alt={imageAlt ?? ''}
      objectFit={imageObjectFit ?? 'cover'}
      rounded={imageRounded ?? false}
      secondUrl={secondImgUrl}
      secondAlt={secondImageAlt}
    />
  ) : null

  let content: React.ReactNode

  if (!imgUrl) {
    content = (
      <div className="w-full">
        <TextBlock {...textProps} />
      </div>
    )
  } else if (imagePosition === 'top' || imagePosition === 'bottom') {
    content = (
      <div className="flex flex-col gap-8 w-full">
        {imagePosition === 'top' && imageBlock}
        <TextBlock {...textProps} />
        {imagePosition === 'bottom' && imageBlock}
      </div>
    )
  } else {
    const isImageLeft = imagePosition === 'left'
    content = (
      <div
        className={`flex flex-col md:flex-row ${vAlignClass} w-full`}
        style={{ gap: `${columnGap}px` }}
      >
        <div
          className={`w-full ${imgColClass} ${isImageLeft ? 'md:order-1' : 'md:order-2'} self-${imageVerticalAlign ?? 'center'}`}
        >
          {imageBlock}
        </div>
        <div className={`w-full ${txtColClass} ${isImageLeft ? 'md:order-2' : 'md:order-1'}`}>
          <TextBlock {...textProps} />
        </div>
      </div>
    )
  }

  return (
    <section
      className={['relative overflow-hidden', className ?? ''].join(' ')}
      style={{
        paddingTop: `${paddingTop}px`,
        paddingBottom: `${paddingBottom}px`,
        ...bgStyle,
      }}
    >
      {backgroundType === 'image' && overlayColor && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: overlayColor }}
        />
      )}

      <div className="container mx-auto px-4 relative z-[1]">{content}</div>
    </section>
  )
}
