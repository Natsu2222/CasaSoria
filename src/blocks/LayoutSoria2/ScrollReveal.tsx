'use client'

import React, { useEffect, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'

const REVEAL_DURATION_MS = 2100
const REVEAL_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

type ScrollRevealProps = {
  children: React.ReactNode
  className?: string
  /** Delay after the element enters the viewport (for staggered reveals). */
  delayMs?: number
}

/**
 * Fades and lifts content into view when it intersects the viewport.
 * Respects `prefers-reduced-motion: reduce` (no animation, content stays visible).
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className,
  delayMs = 0,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      const reduced = mq.matches
      setReducedMotion(reduced)
      if (reduced) setVisible(true)
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const el = ref.current
    if (!el) return

    const reveal = () => setVisible(true)

    const isInView = () => {
      const rect = el.getBoundingClientRect()
      return rect.top < window.innerHeight * 0.92 && rect.bottom > window.innerHeight * 0.02
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal()
            obs.disconnect()
            return
          }
        }
      },
      { root: null, rootMargin: '0px 0px 12% 0px', threshold: 0.02 },
    )

    const startObserver = () => {
      if (isInView()) {
        reveal()
        return
      }
      obs.observe(el)
    }

    const raf = requestAnimationFrame(startObserver)

    const fallback = window.setTimeout(reveal, 2500)

    return () => {
      cancelAnimationFrame(raf)
      obs.disconnect()
      window.clearTimeout(fallback)
    }
  }, [reducedMotion])

  return (
    <div
      ref={ref}
      className={cn(
        !reducedMotion && 'translate-y-8 opacity-0 will-change-[opacity,transform]',
        !reducedMotion && visible && 'translate-y-0 opacity-100',
        reducedMotion && 'opacity-100',
        className,
      )}
      style={
        reducedMotion
          ? undefined
          : {
              transitionProperty: 'opacity, transform',
              transitionDuration: `${REVEAL_DURATION_MS}ms`,
              transitionTimingFunction: REVEAL_EASE,
              transitionDelay: visible ? `${delayMs}ms` : '0ms',
            }
      }
    >
      {children}
    </div>
  )
}
