import type { Post, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'

import { CollectionArchive } from '@/components/CollectionArchive'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id, categories, introContent, limit: limitFromProps, populateBy, selectedDocs } = props

  const limit = limitFromProps || 3

  let posts: Post[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    const fetchedPosts = await payload.find({
      collection: 'posts',
      depth: 1,
      limit,
      ...(flattenedCategories && flattenedCategories.length > 0
        ? {
            where: {
              categories: {
                in: flattenedCategories,
              },
            },
          }
        : {}),
    })

    posts = fetchedPosts.docs
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedPosts = selectedDocs.map((post) => {
        if (typeof post.value === 'object') return post.value
      }) as Post[]

      posts = filteredSelectedPosts
    }
  }

  return (
    <div className="relative" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-14 md:mb-20">
          <div className="payload-block-display max-w-[40rem] text-3xl leading-tight md:text-4xl md:leading-[1.15]">
            <RichText className="payload-block-prose mb-0 max-w-none !text-inherit" data={introContent} enableGutter={false} />
          </div>
          <div className="mt-8 h-px max-w-[min(28rem,88vw)] bg-[linear-gradient(90deg,var(--payload-block-accent),transparent)] opacity-90" />
        </div>
      )}
      <CollectionArchive posts={posts} />
    </div>
  )
}
