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
          'relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-black p-8 font-body text-white md:rounded-[2.5rem] md:p-12 lg:p-14',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
          'flex flex-col gap-10 md:items-center md:justify-between',
          buttonsPosition === 'bottom' && 'md:flex-col md:items-stretch',
          buttonsPosition !== 'bottom' && 'md:flex-row md:items-center',
          buttonsPosition === 'left' && 'md:flex-row-reverse',
        )}
        data-theme="dark"
        style={containerStyle}
      >
        {(bgType === 'image' || (bgType === 'video' && !!embedURL)) && (
          <div className="pointer-events-none absolute inset-0 z-0 origin-center scale-[1.06]">
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
              className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/55 to-black/30"
              style={{ opacity: Math.min(1, overlayOpacity + 0.1) }}
            />
          </div>
        )}

        <div className="relative z-[1] flex max-w-[52rem] flex-1 items-center">
          {richText && (
            <RichText
              className={cn(
                'mb-0 max-w-none',
                '[&_a]:text-white/90 [&_a]:underline-offset-4 [&_a]:transition-colors [&_a]:hover:text-white',
                '[&_p]:text-xl [&_p]:leading-snug [&_p]:font-light [&_p]:text-white/80 sm:[&_p]:text-2xl',
                '[&_strong]:font-medium [&_strong]:text-white',
                '[&_h1]:font-heading [&_h1]:text-center [&_h1]:text-white [&_h1]:italic [&_h1]:tracking-[-0.02em] [&_h1]:leading-[0.92] [&_h1]:text-[clamp(2.75rem,9vw,5.5rem)]',
                '[&_h2]:font-heading [&_h2]:text-white [&_h2]:italic [&_h2]:tracking-tight [&_h2]:text-[clamp(2rem,5vw,3.25rem)] [&_h2]:leading-tight',
                '[&_h3]:font-heading [&_h3]:text-white [&_h3]:italic [&_h3]:text-[clamp(1.5rem,3.5vw,2.25rem)] [&_h3]:leading-tight',
                '[&_h4]:font-body [&_h4]:text-lg [&_h4]:font-medium [&_h4]:tracking-tight [&_h4]:text-white/90',
                buttonsPosition === 'bottom' &&
                  '[&_h2]:text-center [&_h3]:text-center [&_h4]:text-center [&_p]:text-center',
              )}
              data={richText}
              enableGutter={false}
            />
          )}
        </div>
        <div
          className={cn(
            'relative z-[1] flex flex-shrink-0 flex-col flex-wrap items-stretch gap-3 sm:flex-row sm:items-center',
            buttonsPosition === 'right' && 'md:justify-end',
            buttonsPosition === 'left' && 'md:justify-start',
            buttonsPosition === 'bottom' && 'md:justify-center',
          )}
        >
          {(links || []).map(({ link }, i) => {
            const appearance = link.appearance === 'outline' ? 'outline' : 'default'
            if (appearance === 'outline') {
              return (
                <CMSLink
                  key={i}
                  appearance="inline"
                  className="liquid-glass font-body rounded-full px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.03] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_20px_2px_rgba(255,255,255,0.07)] active:scale-[0.97]"
                  label={link.label}
                  newTab={link.newTab}
                  reference={link.reference}
                  type={link.type}
                  url={link.url}
                />
              )
            }
            return (
              <CMSLink
                key={i}
                appearance="inline"
                className="group relative inline-flex overflow-hidden rounded-full bg-white px-6 py-3 font-body text-sm font-medium text-black shadow-[0_0_0_0_rgba(255,255,255,0)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_24px_4px_rgba(255,255,255,0.25)] active:scale-[0.97]"
                newTab={link.newTab}
                reference={link.reference}
                type={link.type}
                url={link.url}
              >
                <span className="relative z-10">{link.label}</span>
                <span className="absolute inset-0 bg-gradient-to-b from-white to-white/85 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              </CMSLink>
            )
          })}
        </div>
      </div>
    </div>
  )
}
