'use client'

import React, { useCallback, useEffect, useId, useRef, useState } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay, A11y } from 'swiper/modules'
import type { Swiper as SwiperClass } from 'swiper'

import 'swiper/css'

import RichText from '@/components/RichText'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { useGoogleFont } from '@/utilities/useGoogleFont'
import { cn } from '@/utilities/ui'

import styles from './TestimonialsMinery.module.css'

import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Media } from '@/payload-types'

const PARALLAX_SPEED = 0.35

type TestimonialItem = {
  quote?: DefaultTypedEditorState | null
  founderImage?: Media | number | null
  founderName?: string | null
  founderRole?: string | null
}

type TestimonialsMineryProps = {
  testimonials?: TestimonialItem[] | null
  backgroundImage?: Media | number | null
  backgroundPosition?:
    | 'center center'
    | 'center top'
    | 'center bottom'
    | 'left center'
    | 'right center'
    | null
  overlayColor?: string | null
  disableParallaxOnTouch?: boolean | null
  enableAutoplay?: boolean | null
  autoplayDelay?: number | null
  transitionSpeed?: number | null
  loop?: boolean | null
  paddingY?: '60' | '90' | '120' | '160' | null
  founderImageSize?: '50' | '70' | '90' | '110' | null
  quoteFont?: string | null
  founderFont?: string | null
  quoteIconColor?: string | null
  quoteTextColor?: string | null
  founderNameColor?: string | null
  founderRoleColor?: string | null
  arrowColor?: string | null
  arrowHoverColor?: string | null
  arrowBorderColor?: string | null
  blockType?: 'testimonialsMinery'
  className?: string
  disableInnerContainer?: boolean
}

function resolveMediaUrl(field: Media | number | null | undefined): string | null {
  if (!field || typeof field === 'number') return null
  return field.url ? getMediaUrl(field.url, field.updatedAt) : null
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

const QuoteSvg: React.FC<{ color: string }> = ({ color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="67"
    height="49"
    viewBox="0 0 280 220"
    aria-hidden="true"
    className="mx-auto mb-6"
  >
    <path
      fill={color}
      d="M135.9,119.2c5.3,8.9,8,19.5,8,31.7c0,18.1-5.8,32.7-17.3,43.6c-11.6,10.9-26.4,16.4-44.5,16.4
        c-18.1,0-33-5.5-44.5-16.4c-11.6-10.9-17.3-25.5-17.3-43.6c0-8.1,1.1-16.3,3.3-24.4c2.2-8.1,7.2-20.5,15-37l32.8-69.9h65.6
        l-23.4,79.2C123.1,103.5,130.6,110.3,135.9,119.2z
        M271.9,119.2c5.3,8.9,8,19.5,8,31.7c0,18.1-5.8,32.7-17.3,43.6
        c-11.6,10.9-26.4,16.4-44.5,16.4c-18.1,0-33-5.5-44.5-16.4c-11.6-10.9-17.3-25.5-17.3-43.6
        c0-8.1,1.1-16.3,3.3-24.4c2.2-8.1,7.2-20.5,15-37l32.8-69.9h65.6l-23.4,79.2
        C259.1,103.5,266.6,110.3,271.9,119.2z"
    />
  </svg>
)

type ArrowProps = {
  direction: 'prev' | 'next'
  uid: string
  onClick: () => void
  arrowColor: string
  arrowHoverColor: string
  arrowBorderColor: string
}

const ArrowButton: React.FC<ArrowProps> = ({
  direction,
  uid,
  onClick,
  arrowColor,
  arrowHoverColor,
  arrowBorderColor,
}) => {
  const isPrev = direction === 'prev'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? 'Anterior testimonio' : 'Siguiente testimonio'}
      className={`testimonial-arrow-${uid} testimonial-arrow-${direction}-${uid}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="18"
        viewBox="0 0 12 20"
        aria-hidden="true"
      >
        {isPrev ? (
          <polyline
            points="10,2 2,10 10,18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <polyline
            points="2,2 10,10 2,18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>

      <style>{`
        .testimonial-arrow-${uid} {
          display: none;
        }
        @media (min-width: 769px) {
          .testimonial-arrow-${uid} {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 52px;
            height: 52px;
            border-radius: 8px;
            border: 1px solid ${arrowBorderColor};
            background: transparent;
            color: ${arrowColor};
            cursor: pointer;
            transition: color 250ms ease, border-color 250ms ease;
          }
          .testimonial-arrow-${uid}:hover {
            color: ${arrowHoverColor};
            border-color: ${arrowHoverColor};
          }
          .testimonial-arrow-prev-${uid} { left: -60px; }
          .testimonial-arrow-next-${uid} { right: -60px; }
        }
      `}</style>
    </button>
  )
}

export const TestimonialsMineryBlock: React.FC<TestimonialsMineryProps> = ({
  testimonials,
  backgroundImage,
  backgroundPosition = 'center center',
  overlayColor,
  disableParallaxOnTouch = true,
  enableAutoplay = false,
  autoplayDelay = 4000,
  transitionSpeed = 400,
  loop = true,
  paddingY = '90',
  founderImageSize = '70',
  quoteFont = 'Montserrat, sans-serif',
  founderFont = 'Montserrat, sans-serif',
  quoteIconColor = '#ffffff',
  quoteTextColor = '#ffffff',
  founderNameColor = '#ffffff',
  founderRoleColor = '#ffffff',
  arrowColor = '#ffffff',
  arrowHoverColor = '#FFC950',
  arrowBorderColor = 'rgba(255,255,255,0.4)',
  className,
}) => {
  const uid = useId().replace(/:/g, '')
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const swiperRef = useRef<SwiperClass | null>(null)
  const [parallaxEnabled, setParallaxEnabled] = useState(false)

  const bgUrl = resolveMediaUrl(backgroundImage)
  const objectPosition = backgroundPosition ?? 'center center'
  const imgSize = Number(founderImageSize ?? 70)
  const resolvedArrowColor = arrowColor ?? '#ffffff'
  const resolvedArrowHoverColor = arrowHoverColor ?? '#FFC950'
  const resolvedArrowBorderColor = arrowBorderColor ?? 'rgba(255,255,255,0.4)'

  useGoogleFont(quoteFont ?? undefined)
  useGoogleFont(founderFont ?? undefined)

  useEffect(() => {
    if (!bgUrl) {
      setParallaxEnabled(false)
      return
    }
    if (disableParallaxOnTouch && window.matchMedia('(hover: none)').matches) {
      setParallaxEnabled(false)
      return
    }
    setParallaxEnabled(true)
  }, [bgUrl, disableParallaxOnTouch])

  const setBgTransform = useCallback((offsetY = 0) => {
    if (!bgRef.current) return
    bgRef.current.style.transform =
      offsetY === 0 ? 'translateX(-50%)' : `translate3d(-50%, ${offsetY}px, 0)`
  }, [])

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

  if (!testimonials?.length) return null

  return (
    <section
      ref={sectionRef}
      className={cn(styles.section, className)}
      style={!bgUrl ? { backgroundColor: '#1e1e1c' } : undefined}
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
        <div className="flex justify-center">
          <div className="w-full max-w-[83.33%] relative">
            <ArrowButton
              direction="prev"
              uid={uid}
              onClick={() => swiperRef.current?.slidePrev()}
              arrowColor={resolvedArrowColor}
              arrowHoverColor={resolvedArrowHoverColor}
              arrowBorderColor={resolvedArrowBorderColor}
            />

            <Swiper
              modules={[Navigation, ...(enableAutoplay ? [Autoplay] : []), A11y]}
              slidesPerView={1}
              loop={loop ?? true}
              speed={transitionSpeed ?? 400}
              autoplay={
                enableAutoplay
                  ? { delay: autoplayDelay ?? 4000, disableOnInteraction: false }
                  : false
              }
              onSwiper={(swiper) => {
                swiperRef.current = swiper
              }}
              className="w-full"
            >
              {testimonials.map((item, i) => {
                const founderImgUrl = resolveMediaUrl(item.founderImage)
                return (
                  <SwiperSlide key={i}>
                    <div className="text-center px-4 md:px-8">
                      <div>
                        <div style={{ fontFamily: quoteFont ?? undefined }}>
                          <QuoteSvg color={quoteIconColor ?? '#ffffff'} />

                          {hasRichText(item.quote) && (
                            <div
                              className="text-base md:text-lg leading-relaxed mb-8 [&_*]:!text-inherit"
                              style={{ color: quoteTextColor ?? undefined }}
                            >
                              <RichText data={item.quote!} />
                            </div>
                          )}
                        </div>

                        <div
                          className="flex items-center justify-center gap-4"
                          style={{ fontFamily: founderFont ?? undefined }}
                        >
                          {founderImgUrl && (
                            <div
                              className="flex-shrink-0 rounded-full overflow-hidden"
                              style={{ width: `${imgSize}px`, height: `${imgSize}px` }}
                            >
                              <Image
                                src={founderImgUrl}
                                alt={item.founderName ?? ''}
                                width={imgSize}
                                height={imgSize}
                                loading="lazy"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          <div className="text-left">
                            {item.founderName && (
                              <span
                                className="block font-semibold text-sm"
                                style={{ color: founderNameColor ?? undefined }}
                              >
                                {item.founderName}
                              </span>
                            )}
                            {item.founderRole && (
                              <p
                                className="text-xs mt-0.5 m-0"
                                style={{ color: founderRoleColor ?? undefined }}
                              >
                                {item.founderRole}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                )
              })}
            </Swiper>

            <ArrowButton
              direction="next"
              uid={uid}
              onClick={() => swiperRef.current?.slideNext()}
              arrowColor={resolvedArrowColor}
              arrowHoverColor={resolvedArrowHoverColor}
              arrowBorderColor={resolvedArrowBorderColor}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
