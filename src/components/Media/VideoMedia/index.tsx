'use client'

import { cn } from '@/utilities/ui'
import React, { useEffect, useRef } from 'react'

import type { Props as MediaProps } from '../types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

export const VideoMedia: React.FC<MediaProps> = (props) => {
  const { onClick, resource, videoClassName } = props

  const videoRef = useRef<HTMLVideoElement>(null)
  // const [showFallback] = useState<boolean>()

  useEffect(() => {
    const { current: video } = videoRef
    if (video) {
      video.addEventListener('suspend', () => {
        // setShowFallback(true);
        // console.warn('Video was suspended, rendering fallback image.')
      })
    }
  }, [])

  if (resource && typeof resource === 'object') {
    // Prefer the `url` field populated by the Media collection's afterRead
    // hook — it points at the R2 public URL when cloud storage is wired up,
    // and falls back to a relative Payload path when running with local
    // storage. The previous hard-coded `/media/${filename}` always pointed
    // at the local disk, which 404s in production now that files live in R2.
    const { filename, url, mimeType } = resource as {
      filename?: string
      url?: string | null
      mimeType?: string | null
    }
    const videoSrc =
      typeof url === 'string' && url.length > 0
        ? getMediaUrl(url)
        : filename
          ? getMediaUrl(`/media/${filename}`)
          : null

    if (!videoSrc) return null

    return (
      <video
        autoPlay
        className={cn(videoClassName)}
        controls={false}
        loop
        muted
        onClick={onClick}
        playsInline
        ref={videoRef}
      >
        <source src={videoSrc} type={typeof mimeType === 'string' ? mimeType : undefined} />
      </video>
    )
  }

  return null
}
