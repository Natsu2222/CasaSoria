'use client'

import React from 'react'

import { resolveFontFamily } from '@/fields/fontFamilySelect'
import { useGoogleFont } from '@/utilities/useGoogleFont'
import { cn } from '@/utilities/ui'

import { ScrollReveal } from './ScrollReveal'

type StatRow = {
  id?: string | null
  value?: string | null
  label?: string | null
}

type TextColumnProps = {
  className?: string
  heading?: string | null
  description?: string | null
  stats?: StatRow[] | null
  fontFamily?: string | null
  headingColor: string
  descriptionColor: string
  statCardBackground: string
  statNumberColor: string
  statLabelColor: string
  radiusStyle: React.CSSProperties
}

export const LayoutSoria2TextColumn: React.FC<TextColumnProps> = ({
  className,
  heading,
  description,
  stats,
  fontFamily,
  headingColor,
  descriptionColor,
  statCardBackground,
  statNumberColor,
  statLabelColor,
  radiusStyle,
}) => {
  const selectedFontFamily = resolveFontFamily(fontFamily)
  useGoogleFont(selectedFontFamily)
  const microType = !selectedFontFamily

  const statItems = Array.isArray(stats) ? stats : []

  return (
    <div
      className={cn('min-w-0 space-y-6 md:space-y-8', microType && 'font-body', className)}
      style={selectedFontFamily ? { fontFamily: selectedFontFamily } : undefined}
    >
      {heading ? (
        <ScrollReveal>
          <h2
            className={cn(
              'text-[clamp(1.75rem,4vw,3rem)] leading-tight tracking-tight',
              microType ? 'font-heading italic' : 'font-bold',
            )}
            style={{ color: headingColor }}
          >
            {heading}
          </h2>
        </ScrollReveal>
      ) : null}
      {description ? (
        <ScrollReveal delayMs={360}>
          <p
            className={cn(
              'max-w-xl leading-relaxed',
              microType
                ? 'text-base font-light sm:text-lg lg:text-xl'
                : 'text-base md:text-lg',
            )}
            style={{ color: descriptionColor }}
          >
            {description}
          </p>
        </ScrollReveal>
      ) : null}
      {statItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {statItems.map((row, index) => {
            const v = row?.value?.trim()
            const lbl = row?.label?.trim()
            if (!v && !lbl) return null
            return (
              <ScrollReveal key={row.id || index} delayMs={620 + index * 260}>
                <div
                  className="flex flex-col justify-center px-5 py-5 shadow-sm md:px-6 md:py-6"
                  style={{ ...radiusStyle, backgroundColor: statCardBackground }}
                >
                  {v ? (
                    <p
                      className={cn(
                        'text-3xl tracking-tight md:text-4xl',
                        microType ? 'font-heading italic leading-none' : 'font-bold',
                      )}
                      style={{ color: statNumberColor }}
                    >
                      {v}
                    </p>
                  ) : null}
                  {lbl ? (
                    <p
                      className={cn(
                        'mt-2 leading-snug',
                        microType
                          ? 'text-sm font-light sm:text-base'
                          : 'text-sm font-medium md:text-base',
                      )}
                      style={{ color: statLabelColor }}
                    >
                      {lbl}
                    </p>
                  ) : null}
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
