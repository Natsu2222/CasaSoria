'use client'

/**
 * TeleprompterBlock
 * ─────────────────
 * Ticker horizontal infinito. Replica el efecto #teleprompter-infinite
 * de Minery Report (/digitalizacion/legalsoft/).
 *
 * ── Técnica ───────────────────────────────────────────────────────────────────
 * Los ítems se renderizan DOS VECES en el DOM (original + clon), lado a lado
 * dentro de un contenedor flex. El contenedor animado se desplaza con
 * CSS @keyframes translateX desde 0 hasta -50% (equivale al ancho del set
 * original), y al llegar al final resetea a 0 sin salto visible — loop perfecto.
 *
 * No depende de JavaScript para la animación: puro CSS.
 * JavaScript solo se usa para inyectar la duración dinámica via style scoped.
 *
 * ── Loop sin salto ────────────────────────────────────────────────────────────
 *   [item1 | item2 | item3 | item1 | item2 | item3]
 *    ←──────── translateX(0 → -50%) ────────────────
 *   Al llegar a -50% el clon ocupa exactamente el lugar del original → reset
 *
 * ── Dirección ────────────────────────────────────────────────────────────────
 *   left  → translateX(0 → -50%)   (por defecto, igual que Minery)
 *   right → translateX(-50% → 0)
 *
 * ── Pausa en hover ────────────────────────────────────────────────────────────
 *   .marquee-track:hover → animation-play-state: paused
 */

import React, { useId } from 'react'
import Image from 'next/image'
import type { TeleprompterBlock } from '@/payload-types'

// ─── Types ───────────────────────────────────────────────────────────────────

type Props = TeleprompterBlock & { className?: string }

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolveUrl(field: unknown): string | null {
  return typeof field === 'object' && field !== null
    ? ((field as { url?: string }).url ?? null)
    : null
}

const SEPARATORS: Record<string, string> = {
  dot:     '•',
  pipe:    '|',
  diamond: '◆',
  dash:    '—',
  arrow:   '→',
}

// ─── Single Item ─────────────────────────────────────────────────────────────

type ItemProps = {
  text?: string | null
  icon?: unknown
  iconAlt?: string | null
  iconSize: number
  fontSize: number
  fontWeight: string
  textColor: string
  textTransform: string
  letterSpacing: string
  iconTint?: string | null
  font: string
}

const MarqueeItem: React.FC<ItemProps> = ({
  text,
  icon,
  iconAlt,
  iconSize,
  fontSize,
  fontWeight,
  textColor,
  textTransform,
  letterSpacing,
  iconTint,
  font,
}) => {
  const iconUrl = resolveUrl(icon)

  return (
    <span
      className="flex items-center gap-2 flex-shrink-0 select-none"
      style={{ fontFamily: font }}
    >
      {iconUrl && (
        <Image
          src={iconUrl}
          alt={iconAlt ?? ''}
          width={iconSize}
          height={iconSize}
          className="flex-shrink-0 object-contain"
          style={{
            width: `${iconSize}px`,
            height: `${iconSize}px`,
            filter: iconTint ?? undefined,
          }}
          aria-hidden={!iconAlt}
        />
      )}
      {text && (
        <span
          style={{
            fontSize: `${fontSize}px`,
            fontWeight,
            color: textColor,
            textTransform: textTransform as React.CSSProperties['textTransform'],
            letterSpacing: `${letterSpacing}px`,
            whiteSpace: 'nowrap',
          }}
        >
          {text}
        </span>
      )}
    </span>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────

export const TeleprompterBlock: React.FC<Props> = ({
  items,
  // separator
  separatorType = 'none',
  separatorCustom,
  separatorColor = '#FFC950',
  // animation
  direction = 'left',
  speed = 30,
  pauseOnHover = true,
  // layout
  height = '80',
  itemGap = '48',
  iconSize = '48',
  fontSize = '16',
  fontWeight = '500',
  // typography
  font = 'Montserrat, sans-serif',
  textTransform = 'none',
  letterSpacing = '0',
  // colors
  backgroundColor = '#1e1e1c',
  textColor = '#ffffff',
  iconTint,
  borderTop,
  borderBottom,
  className,
}) => {
  const uid = useId().replace(/:/g, '')

  if (!items?.length) return null

  const h = Number(height ?? 80)
  const gap = Number(itemGap ?? 48)
  const iSize = Number(iconSize ?? 48)
  const fSize = Number(fontSize ?? 16)
  const dur = Number(speed ?? 30)

  // Separator character
  const sepChar =
    separatorType === 'custom'
      ? (separatorCustom ?? '')
      : separatorType !== 'none'
      ? (SEPARATORS[separatorType] ?? '')
      : null

  // Build list of rendered items (with optional separators between them)
  const itemList = items.flatMap((item, i) => {
    const el = (
      <MarqueeItem
        key={`item-${i}`}
        text={item.text}
        icon={item.icon}
        iconAlt={item.iconAlt}
        iconSize={iSize}
        fontSize={fSize}
        fontWeight={fontWeight ?? '500'}
        textColor={textColor}
        textTransform={textTransform ?? 'none'}
        letterSpacing={letterSpacing ?? '0'}
        iconTint={iconTint}
        font={font}
      />
    )

    if (sepChar && i < items.length - 1) {
      return [
        el,
        <span
          key={`sep-${i}`}
          aria-hidden="true"
          className="flex-shrink-0 select-none"
          style={{ color: separatorColor, fontSize: `${fSize}px` }}
        >
          {sepChar}
        </span>,
      ]
    }
    return [el]
  })

  // Animation keyframes:
  // direction='left'  → 0% { translateX(0) }  100% { translateX(-50%) }
  // direction='right' → 0% { translateX(-50%) } 100% { translateX(0) }
  const fromX = direction === 'right' ? '-50%' : '0%'
  const toX   = direction === 'right' ? '0%'   : '-50%'

  return (
    <div
      className={['overflow-hidden relative', className ?? ''].join(' ')}
      style={{
        backgroundColor,
        height: `${h}px`,
        borderTop: borderTop ?? undefined,
        borderBottom: borderBottom ?? undefined,
      }}
    >
      {/* Scoped keyframes + pause-on-hover */}
      <style>{`
        @keyframes marquee-${uid} {
          from { transform: translateX(${fromX}); }
          to   { transform: translateX(${toX}); }
        }
        .marquee-track-${uid} {
          animation: marquee-${uid} ${dur}s linear infinite;
        }
        ${pauseOnHover ? `.marquee-wrapper-${uid}:hover .marquee-track-${uid} { animation-play-state: paused; }` : ''}
      `}</style>

      {/*
        .marquee-wrapper: el overflow:hidden ya está en la sección padre.
        Aquí centramos verticalmente.
      */}
      <div
        className={`marquee-wrapper-${uid} flex items-center h-full w-full`}
      >
        {/*
          .marquee-track: flex row con los ítems originales + clon.
          Ancho total = 200% del set de ítems → al llegar a -50% el loop es perfecto.
        */}
        <div
          className={`marquee-track-${uid} flex items-center`}
          style={{ gap: `${gap}px`, paddingLeft: `${gap}px` }}
          aria-hidden="false"
        >
          {/* Set original */}
          {itemList}

          {/*
            Padding entre el final del set y el inicio del clon.
            Necesario para que el gap sea uniforme al hacer el loop.
          */}
          <span aria-hidden="true" style={{ minWidth: `${gap}px` }} />

          {/* Clon exacto — aria-hidden para evitar duplicar en lectores de pantalla */}
          <span aria-hidden="true" className={`flex items-center`} style={{ gap: `${gap}px` }}>
            {itemList}
            <span style={{ minWidth: `${gap}px` }} />
          </span>
        </div>
      </div>
    </div>
  )
}
