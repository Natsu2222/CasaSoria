import type { BannerBlock as BannerBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & BannerBlockProps

export const BannerBlock: React.FC<Props> = ({ className, content, style }) => {
  return (
    <div className={cn('mx-auto w-full', className)}>
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl py-4 pl-12 pr-6 md:py-5 md:pl-14 md:pr-10 shadow-[var(--payload-block-shadow)] ring-1 ring-[var(--payload-block-ring)] payload-block-prose',
          {
            'border border-[color-mix(in_oklch,var(--border)_55%,transparent)] bg-[color-mix(in_oklch,var(--payload-block-paper)_94%,transparent)]':
              style === 'info',
            'border border-error/45 bg-error/25 text-[color-mix(in_oklch,var(--foreground)_92%,var(--error))]':
              style === 'error',
            'border border-success/45 bg-success/25': style === 'success',
            'border border-warning/50 bg-warning/22': style === 'warning',
          },
        )}
      >
        <span
          aria-hidden
          className={cn('absolute inset-y-3 left-4 w-1 rounded-full md:left-5', {
            'bg-[color-mix(in_oklch,var(--payload-block-accent)_70%,transparent)]': style === 'info',
            'bg-[color-mix(in_oklch,var(--error)_75%,transparent)]': style === 'error',
            'bg-[color-mix(in_oklch,var(--success)_65%,transparent)]': style === 'success',
            'bg-[color-mix(in_oklch,var(--warning)_55%,transparent)]': style === 'warning',
          })}
        />
        <RichText className="relative text-[1.02rem] leading-relaxed" data={content} enableGutter={false} enableProse={false} />
      </div>
    </div>
  )
}
