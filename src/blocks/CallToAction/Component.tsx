import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

const getBackgroundEmbedURL = (rawURL: string): string | null => {
  let url: URL
  try {
    url = new URL(rawURL)
  } catch {
    return null
  }

  if (url.protocol !== 'https:') return null

  const host = url.hostname.toLowerCase()

  // YouTube
  if (
    host === 'youtube.com' ||
    host === 'www.youtube.com' ||
    host === 'm.youtube.com' ||
    host === 'youtube-nocookie.com' ||
    host === 'www.youtube-nocookie.com' ||
    host === 'youtu.be'
  ) {
    let id: string | null = null

    if (host === 'youtu.be') {
      id = url.pathname.replace('/', '') || null
    } else if (url.pathname === '/watch') {
      id = url.searchParams.get('v')
    } else if (url.pathname.startsWith('/embed/')) {
      id = url.pathname.split('/embed/')[1]?.split('/')[0] || null
    } else if (url.pathname.startsWith('/shorts/')) {
      id = url.pathname.split('/shorts/')[1]?.split('/')[0] || null
    }

    if (!id) return null

    // Background-style params: autoplay + muted + loop (needs playlist=id) + no controls
    const embed = new URL(`https://www.youtube-nocookie.com/embed/${id}`)
    embed.searchParams.set('autoplay', '1')
    embed.searchParams.set('mute', '1')
    embed.searchParams.set('controls', '0')
    embed.searchParams.set('playsinline', '1')
    embed.searchParams.set('loop', '1')
    embed.searchParams.set('playlist', id)
    embed.searchParams.set('modestbranding', '1')
    embed.searchParams.set('rel', '0')
    embed.searchParams.set('fs', '0')
    embed.searchParams.set('disablekb', '1')
    embed.searchParams.set('iv_load_policy', '3')
    // Best-effort UI reduction (some params are ignored by modern YouTube embeds)
    embed.searchParams.set('autohide', '1')
    embed.searchParams.set('showinfo', '0')
    return embed.toString()
  }

  // Vimeo
  if (host === 'vimeo.com' || host === 'www.vimeo.com' || host === 'player.vimeo.com') {
    let id: string | null = null

    if (host === 'player.vimeo.com' && url.pathname.startsWith('/video/')) {
      id = url.pathname.split('/video/')[1]?.split('/')[0] || null
    } else {
      // vimeo.com/<id>
      const parts = url.pathname.split('/').filter(Boolean)
      if (parts.length > 0 && /^\d+$/.test(parts[0]!)) id = parts[0]!
    }

    if (!id) return null

    const embed = new URL(`https://player.vimeo.com/video/${id}`)
    embed.searchParams.set('autoplay', '1')
    embed.searchParams.set('muted', '1')
    embed.searchParams.set('loop', '1')
    embed.searchParams.set('background', '1')
    embed.searchParams.set('controls', '0')
    embed.hash = 't=8s'
    return embed.toString()
  }

  return null
}

export const CallToActionBlock: React.FC<CTABlockProps> = ({
  background,
  buttonsPosition = 'right',
  links,
  richText,
}) => {
  const bgType = background?.type || 'none'

  const containerStyle: React.CSSProperties | undefined =
    bgType === 'solid'
      ? { backgroundColor: background?.solidColor || undefined }
      : bgType === 'gradient'
        ? {
            backgroundImage:
              background?.gradientFrom && background?.gradientTo
                ? `linear-gradient(135deg, ${background.gradientFrom}, ${background.gradientTo})`
                : undefined,
          }
        : undefined

  const overlayOpacity =
    typeof background?.overlayOpacity === 'number' ? background.overlayOpacity : 0.35

  const embedURL =
    bgType === 'video' && typeof background?.videoURL === 'string'
      ? getBackgroundEmbedURL(background.videoURL)
      : null

  const iframeCoverStyle: React.CSSProperties = {
    // Cover the container with a fixed 16:9 video while cropping overflow (no black bars).
    // Technique: size iframe by viewport units, then clamp with min sizes.
    height: '56.25vw', // 9/16 of viewport width
    width: '177.7777778vh', // 16/9 of viewport height
    minHeight: '100%',
    minWidth: '100%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: 0,
  }

  return (
    <div className="container">
      <div
        className={cn(
          'payload-block-grain relative isolate overflow-hidden rounded-3xl border border-[color-mix(in_oklch,var(--border)_65%,transparent)] p-8 md:p-12 lg:p-14 flex flex-col gap-10 md:justify-between md:items-center ring-1 ring-[var(--payload-block-ring)] transition-[transform,box-shadow] duration-500 hover:-translate-y-0.5 hover:shadow-[var(--payload-block-shadow)]',
          buttonsPosition === 'bottom' ? 'md:flex-col md:items-start' : 'md:flex-row',
          buttonsPosition === 'left' && 'md:flex-row-reverse',
          bgType === 'none' && 'payload-block-paper-slab bg-[var(--payload-block-paper)]',
          (bgType === 'image' ||
            bgType === 'video' ||
            bgType === 'solid' ||
            bgType === 'gradient') &&
            'text-white shadow-none hover:shadow-none hover:translate-y-0',
        )}
        style={containerStyle}
      >
        {(bgType === 'image' || (bgType === 'video' && !!embedURL)) && (
          <div className="absolute inset-0 -z-10">
            {bgType === 'image' ? (
              <Media
                className="absolute inset-0"
                fill
                pictureClassName="h-full w-full"
                imgClassName="h-full w-full object-cover"
                resource={background?.image}
              />
            ) : (
              <iframe
                className="pointer-events-none"
                src={embedURL || undefined}
                title="Background video"
                allow="autoplay; encrypted-media; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen={false}
                tabIndex={-1}
                aria-hidden="true"
                style={iframeCoverStyle}
              />
            )}
            <div
              className="absolute inset-0 bg-gradient-to-tr from-black/75 via-black/55 to-black/25"
              style={{ opacity: Math.min(1, overlayOpacity + 0.08) }}
            />
          </div>
        )}

        {bgType === 'none' ? (
          <div className="pointer-events-none absolute inset-y-8 left-4 w-px rounded-full bg-[color-mix(in_oklch,var(--payload-block-accent)_85%,transparent)] opacity-90 max-md:hidden md:left-6" />
        ) : null}

        <div className="relative z-[1] max-w-[52rem] flex items-center">
          {richText && (
            <RichText
              className={cn(
                'mb-0 payload-block-prose',
                (bgType === 'image' ||
                  bgType === 'video' ||
                  bgType === 'solid' ||
                  bgType === 'gradient') &&
                  '!text-white [&_a]:text-white/95 [&_strong]:text-white',
              )}
              data={richText}
              enableGutter={false}
            />
          )}
        </div>
        <div
          className={cn(
            'flex flex-col gap-8',
            buttonsPosition === 'bottom' && 'md:flex-row md:flex-wrap',
          )}
        >
          {(links || []).map(({ link }, i) => {
            return <CMSLink key={i} size="lg" {...link} />
          })}
        </div>
      </div>
    </div>
  )
}
