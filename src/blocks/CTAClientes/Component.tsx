'use client'

import React, { useId, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, A11y } from 'swiper/modules'
import 'swiper/css'

import { getMediaUrl } from '@/utilities/getMediaUrl'

import styles from './CTAClientes.module.css'

import type { CTAClientesBlock, Media } from '@/payload-types'

const LOGO_SIZE_PX = 150
const LOGO_GAP_PX = 64

type Props = CTAClientesBlock & { className?: string }

function resolveUrl(field: unknown): string | null {
  if (typeof field !== 'object' || field === null) return null
  const image = field as Media
  return image.url ? getMediaUrl(image.url, image.updatedAt) : null
}

function getVisibleLogoCount(containerWidth: number): number {
  if (containerWidth < LOGO_SIZE_PX) return 0
  return Math.floor((containerWidth + LOGO_GAP_PX) / (LOGO_SIZE_PX + LOGO_GAP_PX))
}

function getViewportWidth(visibleCount: number): number {
  return visibleCount * LOGO_SIZE_PX + (visibleCount - 1) * LOGO_GAP_PX
}

type LogoItemProps = {
  image: unknown
  alt?: string | null
  url?: string | null
  openInNewTab?: boolean | null
  hoverScale: string
}

const LogoItem: React.FC<LogoItemProps> = ({
  image,
  alt,
  url,
  openInNewTab,
  hoverScale,
}) => {
  const imgUrl = resolveUrl(image)
  if (!imgUrl) return null

  const imgEl = (
    <Image
      src={imgUrl}
      alt={alt ?? ''}
      width={LOGO_SIZE_PX}
      height={LOGO_SIZE_PX}
      loading="lazy"
      className={styles.logoImage}
    />
  )

  const wrapper = (
    <div
      className={styles.logoSlot}
      style={{ '--hover-scale': hoverScale ?? '1.1' } as React.CSSProperties}
    >
      {imgEl}
    </div>
  )

  if (url) {
    return (
      <a
        href={url}
        target={openInNewTab ? '_blank' : undefined}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
        className={styles.logoLink}
      >
        {wrapper}
      </a>
    )
  }

  return wrapper
}

export const CTAClientesBlockComponent: React.FC<Props> = ({
  logos,
  ctaLabel,
  ctaUrl,
  ctaOpenInNewTab = false,
  enableCarousel = true,
  autoplayDelay = 2500,
  transitionSpeed = 400,
  pauseOnHover = true,
  paddingTop = '100',
  paddingBottom = '50',
  hoverScale = '1.1',
  backgroundColor = '#ffffff',
  ctaColor = '#1e1e1c',
  ctaHoverColor = '#FFC950',
  className,
}) => {
  const uid = useId().replace(/:/g, '')
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState(logos?.length ?? 0)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container || !logos?.length) return

    const update = () => {
      const count = getVisibleLogoCount(container.clientWidth)
      setVisibleCount(Math.min(logos.length, Math.max(0, count)))
    }

    update()

    const observer = new ResizeObserver(update)
    observer.observe(container)

    return () => observer.disconnect()
  }, [logos?.length])

  if (!logos?.length || visibleCount === 0) return null

  const useCarousel = enableCarousel !== false && logos.length > visibleCount
  const viewportWidth = getViewportWidth(visibleCount)
  const showOneAtATime = visibleCount === 1

  const logoItems = logos.map((item, i) => (
    <LogoItem
      key={item.id ?? i}
      image={item.image}
      alt={item.alt}
      url={item.url}
      openInNewTab={item.openInNewTab}
      hoverScale={hoverScale ?? '1.1'}
    />
  ))

  return (
    <section
      className={className ?? ''}
      style={{
        paddingTop: `${paddingTop}px`,
        paddingBottom: `${paddingBottom}px`,
        backgroundColor: backgroundColor ?? '#ffffff',
      }}
    >
      <style>{`
        .cta-clientes-${uid} {
          position: relative;
          display: inline-block;
          color: ${ctaColor};
          text-decoration: none;
          font-weight: 700;
          transition: color 300ms ease;
        }
        .cta-clientes-${uid}::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          right: 50%;
          height: 1px;
          background: ${ctaHoverColor};
          transition: left 300ms ease, right 300ms ease;
        }
        .cta-clientes-${uid}:hover { color: ${ctaHoverColor}; }
        .cta-clientes-${uid}:hover::after { left: 0; right: 0; }
      `}</style>

      <div className="container mx-auto px-4">
        <div ref={containerRef} className={styles.logoArea}>
          {useCarousel ? (
            <div className={styles.carouselWrap}>
              <div
                className={styles.carouselViewport}
                style={{ width: `${viewportWidth}px` }}
              >
                <Swiper
                  key={`carousel-${visibleCount}-${logos.length}`}
                  modules={[Autoplay, A11y]}
                  slidesPerView={showOneAtATime ? 1 : 'auto'}
                  slidesPerGroup={1}
                  spaceBetween={LOGO_GAP_PX}
                  loop={logos.length > visibleCount}
                  centeredSlides={showOneAtATime}
                  speed={transitionSpeed ?? 400}
                  autoplay={{
                    delay: autoplayDelay ?? 2500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: pauseOnHover ?? true,
                  }}
                  className={styles.swiper}
                >
                  {logos.map((item, i) => (
                    <SwiperSlide key={item.id ?? i} className={styles.swiperSlide}>
                      <LogoItem
                        image={item.image}
                        alt={item.alt}
                        url={item.url}
                        openInNewTab={item.openInNewTab}
                        hoverScale={hoverScale ?? '1.1'}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          ) : (
            <div
              className={styles.logoRow}
              style={{ width: `${viewportWidth}px` }}
            >
              {logoItems}
            </div>
          )}
        </div>

        {ctaLabel && ctaUrl && (
          <div className="text-center mt-[70px]">
            <Link
              href={ctaUrl}
              target={ctaOpenInNewTab ? '_blank' : undefined}
              rel={ctaOpenInNewTab ? 'noopener noreferrer' : undefined}
              className={`cta-clientes-${uid}`}
            >
              {ctaLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
