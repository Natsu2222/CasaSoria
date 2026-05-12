import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { CMSLink } from '../../components/Link'

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns } = props

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  return (
    <div className="container">
      <div className="relative rounded-[2rem] border border-[color-mix(in_oklch,var(--border)_70%,transparent)] bg-[color-mix(in_oklch,var(--payload-block-paper)_88%,transparent)] px-6 py-12 md:px-12 md:py-16 lg:px-16 lg:py-20 shadow-[var(--payload-block-shadow)] ring-1 ring-[var(--payload-block-ring)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-[color-mix(in_oklch,var(--payload-block-accent)_22%,transparent)] blur-3xl max-md:hidden"
        />
        <div className="relative grid grid-cols-4 lg:grid-cols-12 gap-y-12 gap-x-12 lg:gap-x-20">
          {columns &&
            columns.length > 0 &&
            columns.map((col, index) => {
              const { enableLink, link, richText, size } = col

              return (
                <div
                  className={cn(`col-span-4 lg:col-span-${colsSpanClasses[size!]}`, {
                    'md:col-span-2': size !== 'full',
                  })}
                  key={index}
                >
                  {richText && (
                    <RichText
                      className="payload-block-prose mb-0"
                      data={richText}
                      enableGutter={false}
                    />
                  )}

                  {enableLink ? (
                    <div className="mt-8">
                      <CMSLink {...link} />
                    </div>
                  ) : null}
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
