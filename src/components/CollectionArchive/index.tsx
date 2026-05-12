import { cn } from '@/utilities/ui'
import React from 'react'

import { Card, CardPostData } from '@/components/Card'

export type Props = {
  posts: CardPostData[]
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts } = props

  return (
    <div className={cn('container')}>
      <div>
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
          {posts?.map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              return (
                <div className="col-span-4" key={index}>
                  <Card
                    className="payload-archive-card group h-full overflow-hidden rounded-[1.25rem] border-0 bg-[color-mix(in_oklch,var(--payload-block-paper)_93%,transparent)] shadow-[var(--payload-block-shadow)] ring-1 ring-[var(--payload-block-ring)] transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_30px_70px_-36px_oklch(22%_0.05_55deg_/_0.42)]"
                    doc={result}
                    relationTo="posts"
                    showCategories
                  />
                </div>
              )
            }

            return null
          })}
        </div>
      </div>
    </div>
  )
}
