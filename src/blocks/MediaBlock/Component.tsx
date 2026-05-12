import type { StaticImageData } from 'next/image'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { MediaBlock as MediaBlockProps } from '@/payload-types'

import { Media } from '../../components/Media'

type Props = MediaBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    media,
    staticImage,
    disableInnerContainer,
  } = props

  let caption
  if (media && typeof media === 'object') caption = media.caption

  return (
    <figure
      className={cn(
        'group relative',
        {
          container: enableGutter,
        },
        className,
      )}
    >
      {(media || staticImage) && (
        <div className="relative overflow-hidden rounded-[1.35rem] bg-muted shadow-[var(--payload-block-shadow)] ring-1 ring-[var(--payload-block-ring)] transition-[transform,box-shadow] duration-700 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_36px_80px_-40px_oklch(22%_0.05_55deg_/_0.45)]">
          <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-tr from-[color-mix(in_oklch,var(--payload-block-accent)_14%,transparent)] via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 mix-blend-multiply dark:mix-blend-soft-light" />
          <Media
            imgClassName={cn(
              'relative z-0 border-0 rounded-[1.35rem] object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.02]',
              imgClassName,
            )}
            resource={media}
            src={staticImage}
          />
        </div>
      )}
      {caption && (
        <figcaption
          className={cn(
            'payload-block-prose mt-8 max-w-prose text-[0.95rem] italic text-muted-foreground [&_p]:leading-relaxed',
            {
              container: !disableInnerContainer,
            },
            captionClassName,
          )}
        >
          <RichText data={caption} enableGutter={false} />
        </figcaption>
      )}
    </figure>
  )
}
