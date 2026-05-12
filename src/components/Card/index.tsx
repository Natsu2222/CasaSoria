'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'overflow-hidden border border-border bg-card hover:cursor-pointer rounded-lg',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        {!metaImage && (
          <div className="payload-block-display flex h-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
        {metaImage && typeof metaImage !== 'string' && (
          <Media
            className="absolute inset-0 block h-full w-full"
            fill
            imgClassName="object-cover transition-[transform] duration-[900ms] ease-out group-hover:scale-[1.05]"
            pictureClassName="absolute inset-0 block h-full w-full"
            resource={metaImage}
            size="33vw"
          />
        )}
      </div>
      <div className="payload-block-prose space-y-3 px-6 pb-7 pt-6">
        {showCategories && hasCategories && (
          <div className="mb-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[color-mix(in_oklch,var(--payload-block-accent)_65%,var(--muted-foreground))]">
            {categories?.map((category, index) => {
              if (typeof category === 'object') {
                const { title: titleFromCategory } = category

                const categoryTitle = titleFromCategory || 'Untitled category'

                const isLast = index === categories.length - 1

                return (
                  <Fragment key={index}>
                    {categoryTitle}
                    {!isLast && <Fragment>, &nbsp;</Fragment>}
                  </Fragment>
                )
              }

              return null
            })}
          </div>
        )}
        {titleToUse && (
          <div className="prose max-w-none dark:prose-invert">
            <h3 className="payload-block-display mb-0 text-[1.35rem] leading-snug tracking-tight transition-colors group-hover:text-[color-mix(in_oklch,var(--foreground)_82%,var(--payload-block-accent))]">
              <Link className="not-prose text-inherit no-underline hover:underline hover:decoration-[color-mix(in_oklch,var(--payload-block-accent)_70%,transparent)] hover:underline-offset-4" href={href} ref={link.ref}>
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}
        {description && (
          <p className="line-clamp-3 text-[0.98rem] leading-relaxed text-muted-foreground">{sanitizedDescription}</p>
        )}
      </div>
    </article>
  )
}
