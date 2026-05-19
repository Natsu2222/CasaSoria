'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'
import { getMediaUrl } from '@/utilities/getMediaUrl'

import type { Header as HeaderType, Media } from '@/payload-types'

// ─────────────────────────────────────────────────────────────────────────────
// Navbar Soria
//
// Horizontal navbar with the logo on the left and the menu items on the right
// on desktop. On smaller viewports (or when the editor forces it) the items
// collapse into a hamburger button that opens a side drawer from the right.
//
// All visual options (background color, text color, sticky behaviour and
// whether the drawer is also used on desktop) are configurable from the
// Payload admin so editors don't need to touch CSS.
// ─────────────────────────────────────────────────────────────────────────────

type NavbarSoriaProps = {
  data: HeaderType
  // Optional `data-theme` value forwarded from the parent. We render it
  // directly on the `<header>` so the wrapping component doesn't need an
  // extra `<div>` — that wrapper used to break `position: sticky` because
  // it became the sticky containing block and shrank to the header height.
  dataTheme?: string | null
}

export const NavbarSoria: React.FC<NavbarSoriaProps> = ({ data, dataTheme }) => {
  const navbar = data?.navbarSoria ?? null
  const items = Array.isArray(navbar?.sidebarItems) ? navbar?.sidebarItems ?? [] : []
  const cta = navbar?.cta?.link ?? null
  // When `sticky` is true the navbar stays anchored to the top no matter what.
  // When it's false we still use `sticky` positioning so the bar sits on top
  // of the content, but it slides out of view as the user scrolls down and
  // drops back in as soon as they scroll up (auto-hide pattern).
  const pinned = navbar?.sticky ?? true
  const forceDrawer = navbar?.showHamburgerOnDesktop ?? false

  const logoMedia =
    typeof navbar?.logo === 'object' && navbar?.logo !== null ? (navbar.logo as Media) : null
  const logoUrl = logoMedia?.url ? getMediaUrl(logoMedia.url) : null
  const logoAlt = (logoMedia?.alt as string | undefined) ?? navbar?.logoText ?? 'Logo'
  const logoText = navbar?.logoText ?? null

  // Preserve the logo's intrinsic aspect ratio when available so wide
  // wordmarks don't get cropped inside a square container. We render the
  // image at its natural ratio and let the `max-h-*` classes constrain
  // the displayed height across breakpoints.
  const logoIntrinsicWidth = logoMedia?.width ?? 240
  const logoIntrinsicHeight = logoMedia?.height ?? 80

  const [open, setOpen] = useState(false)

  // Auto-hide behaviour: when `pinned` is false the navbar slides out of view
  // as the user scrolls down and drops back in as soon as they scroll up,
  // freeing vertical space for the content while keeping the navigation one
  // tiny gesture away. When `pinned` is true we skip this entirely so the
  // bar is permanently visible.
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    if (pinned) {
      setHidden(false)
      return
    }

    // Threshold below which we never hide — at the very top of the page the
    // navbar should always be visible, regardless of scroll direction.
    const TOP_THRESHOLD = 80
    // Minimum delta between scroll events before we react. Avoids flicker
    // when the browser fires tiny scrolls (trackpad inertia, mobile rubber
    // band, etc.).
    const DELTA = 6

    const onScroll = () => {
      const currentY = window.scrollY
      const diff = currentY - lastScrollY.current

      if (currentY <= TOP_THRESHOLD) {
        setHidden(false)
      } else if (Math.abs(diff) > DELTA) {
        // Scrolling down ⇒ hide. Scrolling up ⇒ show.
        setHidden(diff > 0)
      }

      lastScrollY.current = currentY
    }

    lastScrollY.current = window.scrollY
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pinned])

  // Close the drawer on Escape and lock the body scroll while it's open so
  // the page below doesn't jump as the user interacts with the panel.
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const headerStyle: React.CSSProperties = {
    backgroundColor: navbar?.backgroundColor ?? undefined,
    color: navbar?.textColor ?? undefined,
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-30 w-full border-b border-transparent backdrop-blur-md',
        'transition-[transform,colors] duration-300 ease-out will-change-transform',
        hidden ? '-translate-y-full' : 'translate-y-0',
        navbar?.backgroundColor ? '' : 'bg-background/80',
      )}
      style={headerStyle}
      {...(dataTheme ? { 'data-theme': dataTheme } : {})}
    >
      <div className="container flex h-20 items-center justify-between gap-4 sm:h-24 md:h-28">
        {/* ── Branding ─────────────────────────────────────────────────── */}
        <Link
          href="/"
          className="flex items-center gap-3 font-medium tracking-tight sm:gap-4"
          aria-label="Inicio"
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={logoAlt}
              width={logoIntrinsicWidth}
              height={logoIntrinsicHeight}
              priority
              sizes="(max-width: 640px) 160px, (max-width: 1024px) 220px, 280px"
              className="h-12 w-auto object-contain sm:h-14 md:h-16 lg:h-20"
            />
          ) : null}
          {logoText ? (
            <span
              className="text-lg font-semibold sm:text-xl md:text-2xl"
              style={{ color: navbar?.textColor ?? undefined }}
            >
              {logoText}
            </span>
          ) : null}
        </Link>

        {/* ── Desktop items ────────────────────────────────────────────── */}
        {!forceDrawer ? (
          <nav className="hidden items-center gap-7 md:flex" aria-label="Principal">
            {items.map(({ link, id }, i) => (
              <CMSLink
                key={id ?? i}
                {...link}
                appearance="inline"
                className="text-sm transition-opacity hover:opacity-70"
              />
            ))}
            {cta?.label ? (
              <CMSLink
                {...cta}
                appearance="inline"
                className={cn(
                  'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium',
                  'bg-foreground text-background transition-transform hover:scale-[1.03]',
                )}
              />
            ) : null}
          </nav>
        ) : null}

        {/* ── Hamburger ────────────────────────────────────────────────── */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            'inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 transition-colors hover:bg-foreground/5',
            forceDrawer ? 'flex' : 'md:hidden',
          )}
          aria-label="Abrir menú"
          aria-expanded={open}
          aria-controls="navbar-soria-drawer"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* ── Drawer (mobile / forced) ───────────────────────────────────── */}
      <div
        id="navbar-soria-drawer"
        className={cn(
          'fixed inset-0 z-40 transition-[visibility]',
          open ? 'visible' : 'invisible delay-300',
        )}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          className={cn(
            'absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300',
            open ? 'opacity-100' : 'opacity-0',
          )}
          onClick={() => setOpen(false)}
        />

        {/* Panel */}
        <aside
          className={cn(
            'absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-background shadow-2xl transition-transform duration-300 ease-out',
            open ? 'translate-x-0' : 'translate-x-full',
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
        >
          <div className="flex items-center justify-between gap-4 border-b border-foreground/10 px-6 py-5">
            <span className="text-sm font-medium uppercase tracking-[0.25em] text-foreground/60">
              Menú
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 transition-colors hover:bg-foreground/5"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav
            className="flex flex-1 flex-col gap-1 overflow-y-auto px-6 py-6"
            aria-label="Menú lateral"
          >
            {items.map(({ link, id }, i) => (
              <CMSLink
                key={id ?? i}
                {...link}
                appearance="inline"
                className="block rounded-lg px-3 py-3 text-lg font-medium transition-colors hover:bg-foreground/5"
              />
            ))}

            {cta?.label ? (
              <CMSLink
                {...cta}
                appearance="inline"
                className={cn(
                  'mt-6 inline-flex items-center justify-center rounded-full px-5 py-3 text-base font-medium',
                  'bg-foreground text-background transition-transform hover:scale-[1.02]',
                )}
              />
            ) : null}
          </nav>
        </aside>
      </div>
    </header>
  )
}

export default NavbarSoria
