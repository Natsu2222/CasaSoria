'use client'

import gsap from 'gsap'
import { LayoutTemplate } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import { CMSLink } from '@/components/Link'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { getMediaUrl } from '@/utilities/getMediaUrl'

import type { Page } from '@/payload-types'

const FALLBACK_VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_080827_a9e5ad52-b6ee-4e79-b393-d936f179cfd7.mp4'

function resolveHeroVideoSrc(micro: Page['hero']['microVisuals'] | null | undefined): string {
  if (!micro) return FALLBACK_VIDEO_SRC
  const override = micro.videoUrl?.trim()
  if (override) return override
  const m = micro.backgroundVideo
  if (typeof m === 'object' && m) {
    // Prefer the URL populated by the Media collection's afterRead hook
    // (points at R2 in production). Fall back to the legacy local path only
    // if the CMS hasn't filled `url` for some reason.
    if (m.url?.trim()) return getMediaUrl(m.url)
    if (m.filename) return getMediaUrl(`/media/${m.filename}`)
  }
  return FALLBACK_VIDEO_SRC
}

function LogoMark() {
  return (
    <svg
      aria-hidden
      className="shrink-0 text-white"
      height={26}
      viewBox="0 0 44 26"
      width={44}
    >
      <rect fill="currentColor" height={20} rx={3} width={14} x={0} y={3} />
      <rect fill="currentColor" height={20} rx={3} width={12} x={16} y={3} />
      <rect fill="currentColor" height={20} rx={3} width={14} x={30} y={3} />
    </svg>
  )
}

export const MicroVisualsHero: React.FC<Page['hero']> = ({ microVisuals: micro }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const [mounted, setMounted] = useState(false)
  const [framesReady, setFramesReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoBgRef = useRef<HTMLDivElement>(null)
  const displayCanvasRef = useRef<HTMLCanvasElement>(null)
  const framesRef = useRef<HTMLCanvasElement[]>([])

  const videoSrc = resolveHeroVideoSrc(micro)

  const title = micro?.title?.trim() || 'MicroVisuals'
  const leftCaption =
    micro?.leftCaption?.trim() ||
    "Forma's AI understands context, composition, and style like a creative director would."
  const rightCaption =
    micro?.rightCaption?.trim() ||
    'Describe what you see in your head — get images that actually match.'
  const showSecondaryIcon = micro?.showSecondaryIcon !== false

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setFramesReady(false)
    framesRef.current = []
  }, [videoSrc])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoSrc) return

    let capturing = true
    let lastTime = -1
    const MAX_WIDTH = 960
    const frames: HTMLCanvasElement[] = []
    let rafId: number | null = null
    let rvfcId: number | null = null
    let started = false

    const captureFrame = () => {
      if (!capturing) return
      if (video.readyState < 2) return
      if (video.currentTime === lastTime) return
      lastTime = video.currentTime
      const scale = Math.min(1, MAX_WIDTH / video.videoWidth)
      const w = Math.round(video.videoWidth * scale)
      const h = Math.round(video.videoHeight * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.drawImage(video, 0, 0, w, h)
      frames.push(canvas)
    }

    const loop = () => {
      if (!capturing) return
      captureFrame()
      if (!capturing) return
      const schedule = video.requestVideoFrameCallback
      if (typeof schedule === 'function') {
        rvfcId = schedule.call(video, () => {
          loop()
        })
      } else {
        rafId = window.requestAnimationFrame(loop)
      }
    }

    const onEnded = () => {
      capturing = false
      framesRef.current = frames
      setFramesReady(true)
    }

    const onLoaded = () => {
      if (started) return
      started = true
      void video.play().catch(() => {})
      loop()
    }

    video.addEventListener('loadedmetadata', onLoaded)
    video.addEventListener('ended', onEnded)
    if (video.readyState >= 1) {
      onLoaded()
    }

    return () => {
      capturing = false
      video.removeEventListener('loadedmetadata', onLoaded)
      video.removeEventListener('ended', onEnded)
      if (rafId != null) window.cancelAnimationFrame(rafId)
      const cancel = video.cancelVideoFrameCallback
      if (typeof cancel === 'function' && rvfcId != null) {
        cancel.call(video, rvfcId)
      }
    }
  }, [videoSrc])

  useEffect(() => {
    if (!framesReady) return
    const frames = framesRef.current
    if (frames.length === 0) return
    const canvas = displayCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const first = frames[0]
    canvas.width = first.width
    canvas.height = first.height

    let index = 0
    let direction = 1
    let last = performance.now()
    const interval = 1000 / 30
    let raf = 0

    const render = (now: number) => {
      if (now - last >= interval) {
        last = now
        const frame = frames[index]
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height)
        index += direction
        if (index >= frames.length - 1) {
          index = frames.length - 1
          direction = -1
        } else if (index <= 0) {
          index = 0
          direction = 1
        }
      }
      raf = requestAnimationFrame(render)
    }

    raf = requestAnimationFrame(render)
    return () => cancelAnimationFrame(raf)
  }, [framesReady])

  useEffect(() => {
    const strength = 20
    const targetX = { current: 0 }
    const targetY = { current: 0 }
    const currentX = { current: 0 }
    const currentY = { current: 0 }
    let rafId = 0

    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      targetX.current = ((e.clientX - cx) / cx) * strength
      targetY.current = ((e.clientY - cy) / cy) * strength
    }

    const tick = () => {
      currentX.current += (targetX.current - currentX.current) * 0.06
      currentY.current += (targetY.current - currentY.current) * 0.06
      const el = videoBgRef.current
      if (el) {
        gsap.set(el, { x: currentX.current, y: currentY.current })
      }
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    rafId = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      className="relative -mt-[10.4rem] min-h-screen overflow-x-clip bg-black font-body text-white"
      data-theme="dark"
    >
      <div
        ref={videoBgRef}
        className="pointer-events-none absolute inset-0 z-0 origin-center scale-[1.08] will-change-transform"
      >
        <video
          key={videoSrc}
          ref={videoRef}
          className="pointer-events-none h-full w-full object-cover"
          crossOrigin="anonymous"
          muted
          playsInline
          preload="auto"
          src={videoSrc}
          style={{ display: framesReady ? 'none' : 'block' }}
        />
        <canvas
          ref={displayCanvasRef}
          className="pointer-events-none h-full w-full object-cover"
          style={{ display: framesReady ? 'block' : 'none' }}
        />
      </div>

      <div
        className={`pointer-events-auto absolute right-0 left-0 z-20 w-full px-4 transition-all duration-1000 ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
        style={{ top: '126px' }}
      >
        <h1 className="hero-title select-none">{title}</h1>
      </div>

      <nav className="pointer-events-auto absolute top-5 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap">
        <div className="liquid-glass flex items-center gap-6 rounded-full px-4 py-2.5">
          <LogoMark />
          <div className="flex items-center gap-5">
            {micro?.navItems?.map(({ id, link: navLink }) =>
              navLink?.label ? (
                <CMSLink
                  key={id}
                  appearance="inline"
                  className="font-body text-sm font-light text-white/70 transition-colors duration-200 hover:text-white"
                  label={navLink.label}
                  newTab={navLink.newTab}
                  reference={navLink.reference}
                  type={navLink.type}
                  url={navLink.url}
                />
              ) : null,
            )}
          </div>
          <div className="ml-4 flex items-center gap-3 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl backdrop-saturate-150">
            {micro?.signIn ? (
              <CMSLink
                appearance="inline"
                className="font-body text-sm font-light text-white/70 transition-colors duration-200 hover:text-white"
                label={micro.signIn.label?.trim() || 'Productos'}
                newTab={micro.signIn.newTab}
                reference={micro.signIn.reference}
                type={micro.signIn.type}
                url={micro.signIn.url}
              />
            ) : null}
            {micro?.tryItFree ? (
              <CMSLink
                appearance="inline"
                className="liquid-glass-strong font-body text-sm font-medium text-white transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_16px_2px_rgba(255,255,255,0.12)] active:scale-[0.97] rounded-full px-4 py-1.5"
                label={micro.tryItFree.label?.trim() || 'Presupuesto'}
                newTab={micro.tryItFree.newTab}
                reference={micro.tryItFree.reference}
                type={micro.tryItFree.type}
                url={micro.tryItFree.url}
              />
            ) : null}
          </div>
        </div>
      </nav>

      <div
        className={`pointer-events-auto absolute right-0 bottom-[calc(1.5rem+2%)] left-0 z-20 flex flex-col gap-10 px-6 pb-2 transition-all delay-300 duration-1000 md:bottom-[calc(2.5rem+4%)] md:flex-row md:items-end md:justify-between md:gap-0 md:px-10 md:pb-0 ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        <div className="grid w-full grid-cols-2 gap-x-4 gap-y-3 md:contents">
          <p className="font-body text-base leading-relaxed font-light text-white/80 sm:text-lg lg:text-xl md:max-w-[min(100%,340px)]">
            {leftCaption}
          </p>
          <p className="font-body text-right text-base leading-relaxed font-light text-white/80 sm:text-lg lg:text-xl md:max-w-[min(100%,340px)]">
            {rightCaption}
          </p>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3 max-md:pb-1 md:absolute md:bottom-0 md:left-1/2 md:mt-0 md:-translate-x-1/2">
          {micro?.primaryCta?.label ? (
            <CMSLink
              appearance="inline"
              className="group relative overflow-hidden rounded-full bg-white px-6 py-3 text-sm font-medium text-black shadow-[0_0_0_0_rgba(255,255,255,0)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_24px_4px_rgba(255,255,255,0.25)] active:scale-[0.97] font-body"
              newTab={micro.primaryCta.newTab}
              reference={micro.primaryCta.reference}
              type={micro.primaryCta.type}
              url={micro.primaryCta.url}
            >
              <span className="relative z-10">{micro.primaryCta.label}</span>
              <span className="absolute inset-0 bg-gradient-to-b from-white to-white/85 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            </CMSLink>
          ) : null}
          {micro?.secondaryCta?.label ? (
            <CMSLink
              appearance="inline"
              className="liquid-glass group rounded-full px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.03] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_20px_2px_rgba(255,255,255,0.07)] active:scale-[0.97] font-body"
              newTab={micro.secondaryCta.newTab}
              reference={micro.secondaryCta.reference}
              type={micro.secondaryCta.type}
              url={micro.secondaryCta.url}
            >
              <span className="inline-flex items-center gap-2">
                {showSecondaryIcon ? (
                  <LayoutTemplate aria-hidden className="size-4 opacity-80" strokeWidth={1.5} />
                ) : null}
                {micro.secondaryCta.label}
              </span>
            </CMSLink>
          ) : null}
        </div>
      </div>
    </div>
  )
}
