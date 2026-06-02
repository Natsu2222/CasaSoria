'use client'

import React, { useId } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, EffectFade, A11y } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

import RichText from '@/components/RichText'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { useGoogleFont } from '@/utilities/useGoogleFont'

import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Media } from '@/payload-types'

type SlideItem = {
  id?: string | null
  image: Media | number
  imageAlt?: string | null
  company?: DefaultTypedEditorState | null
  description?: DefaultTypedEditorState | null
}

type CasosExitoProps = {
  eyebrow?: DefaultTypedEditorState | null
  heading?: DefaultTypedEditorState | null
  slides?: SlideItem[] | null
  effect?: 'fade' | 'slide' | null
  autoplay?: boolean | null
  autoplayDelay?: number | null
  loop?: boolean | null
  speed?: number | null
  pauseOnHover?: boolean | null
  imagePosition?: 'left' | 'right' | null
  imageSplit?: '50/50' | '60/40' | '40/60' | null
  slideMinHeight?: number | null
  sectionBackground?: string | null
  slideBackground?: string | null
  headerFont?: string | null
  slideFont?: string | null
  eyebrowColor?: string | null
  headingColor?: string | null
  companyColor?: string | null
  descriptionColor?: string | null
  dotsColor?: string | null
  blockType?: 'casosExito'
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

function splitToClasses(split: string, side: 'image' | 'text') {
  const map: Record<string, [string, string]> = {
    '50/50': ['w-full lg:w-1/2', 'w-full lg:w-1/2'],
    '60/40': ['w-full lg:w-[60%]', 'w-full lg:w-[40%]'],
    '40/60': ['w-full lg:w-[40%]', 'w-full lg:w-[60%]'],
  }
  const [imgW, txtW] = map[split] ?? map['50/50']
  return side === 'image' ? imgW : txtW
}

function resolveImageUrl(image: Media | number): string | null {
  if (typeof image === 'object' && image !== null && 'url' in image) {
    return getMediaUrl(image.url, image.updatedAt) || null
  }
  return null
}

export const CasosExitoBlock: React.FC<CasosExitoProps> = ({
  eyebrow,
  heading,
  slides,
  effect = 'fade',
  autoplay: autoplayEnabled = true,
  autoplayDelay = 4500,
  loop = true,
  speed = 800,
  pauseOnHover = true,
  imagePosition = 'left',
  imageSplit = '50/50',
  slideMinHeight = 420,
  sectionBackground = '#ffffff',
  slideBackground = '#f3f3f3',
  headerFont = 'Montserrat, sans-serif',
  slideFont = 'Montserrat, sans-serif',
  eyebrowColor = '#FFC950',
  headingColor = '#1e1e1c',
  companyColor = '#1e1e1c',
  descriptionColor = '#1e1e1c',
  dotsColor = '#FFC950',
  className,
}) => {
  const uid = useId().replace(/:/g, '')

  useGoogleFont(headerFont ?? undefined)
  useGoogleFont(slideFont ?? undefined)

  if (!slides?.length) return null

  const imgOrder = imagePosition === 'right' ? 'order-2' : 'order-1'
  const txtOrder = imagePosition === 'right' ? 'order-1' : 'order-2'
  const imgW = splitToClasses(imageSplit ?? '50/50', 'image')
  const txtW = splitToClasses(imageSplit ?? '50/50', 'text')

  const swiperModules = [A11y, Pagination]
  if (autoplayEnabled) swiperModules.push(Autoplay)
  if (effect === 'fade') swiperModules.push(EffectFade)

  return (
    <section
      className={['py-16', className ?? ''].join(' ')}
      style={{ background: sectionBackground ?? undefined }}
    >
      <style>{`
        #swiper-${uid} .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: ${dotsColor};
          opacity: 0.35;
          border-radius: 50%;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        #swiper-${uid} .swiper-pagination-bullet-active {
          opacity: 1;
          transform: scale(1.25);
          background: ${dotsColor};
        }
        #swiper-${uid} .swiper-pagination {
          bottom: 16px;
        }
        #swiper-${uid} .swiper-slide {
          backface-visibility: hidden;
        }
      `}</style>

      <div className="container mx-auto px-4">
        {(hasRichText(eyebrow) || hasRichText(heading)) && (
          <div className="mb-10" style={{ fontFamily: headerFont ?? undefined }}>
            {hasRichText(eyebrow) && (
              <div
                className="
                  flex items-center gap-4 mb-3
                  text-xs font-bold uppercase tracking-[3px]
                  [&_*]:!text-inherit
                "
                style={{ color: eyebrowColor ?? undefined }}
              >
                <span
                  className="block flex-shrink-0"
                  style={{ width: '54px', height: '2px', background: eyebrowColor ?? undefined }}
                  aria-hidden="true"
                />
                <RichText data={eyebrow!} />
              </div>
            )}
            {hasRichText(heading) && (
              <div
                className="font-semibold leading-tight [&_*]:!text-inherit"
                style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: headingColor ?? undefined }}
              >
                <RichText data={heading!} />
              </div>
            )}
          </div>
        )}

        <div id={`swiper-${uid}`}>
          <Swiper
            modules={swiperModules}
            effect={effect === 'fade' ? 'fade' : undefined}
            fadeEffect={effect === 'fade' ? { crossFade: true } : undefined}
            speed={speed ?? 800}
            loop={loop ?? true}
            autoplay={
              autoplayEnabled
                ? {
                    delay: autoplayDelay ?? 4500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: pauseOnHover ?? true,
                  }
                : false
            }
            pagination={{ clickable: true }}
            grabCursor
            a11y={{ enabled: true }}
            style={{ paddingBottom: '48px' }}
          >
            {slides.map((slide, index) => {
              const imgUrl = resolveImageUrl(slide.image)

              return (
                <SwiperSlide key={slide.id ?? index}>
                  <div
                    className="flex flex-col lg:flex-row overflow-hidden rounded-sm"
                    style={{
                      minHeight: `${slideMinHeight ?? 420}px`,
                      fontFamily: slideFont ?? undefined,
                    }}
                  >
                    <div className={`${imgW} ${imgOrder} relative min-h-[240px] lg:min-h-0`}>
                      {imgUrl && (
                        <Image
                          src={imgUrl}
                          alt={slide.imageAlt ?? ''}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          priority={index === 0}
                        />
                      )}
                    </div>

                    <div
                      className={`
                        ${txtW} ${txtOrder}
                        flex flex-col justify-center
                        px-10 py-10 lg:px-14 lg:py-12
                      `}
                      style={{ background: slideBackground ?? undefined }}
                    >
                      {hasRichText(slide.company) && (
                        <div
                          className="
                            font-extrabold uppercase mb-4
                            tracking-wider leading-tight
                            [&_*]:!text-inherit
                          "
                          style={{
                            fontSize: 'clamp(22px, 3vw, 32px)',
                            color: companyColor ?? undefined,
                          }}
                        >
                          <RichText data={slide.company!} />
                        </div>
                      )}

                      {hasRichText(slide.description) && (
                        <div
                          className="leading-relaxed text-sm lg:text-base [&_*]:!text-inherit"
                          style={{ color: descriptionColor ?? undefined }}
                        >
                          <RichText data={slide.description!} />
                        </div>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
      </div>
    </section>
  )
}
