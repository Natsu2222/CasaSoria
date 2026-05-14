import React from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { LayoutSoriaBlock } from '@/blocks/LayoutSoria/Component'
import { LocationBlock } from '@/blocks/LocationBlock/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { ProductsBlock } from '@/blocks/ProductsBlock/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  layoutSoria: LayoutSoriaBlock,
  locationBlock: LocationBlock,
  mediaBlock: MediaBlock,
  productsBlock: ProductsBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <div className="payload-blocks-root flex flex-col gap-24 md:gap-32" data-payload-blocks="">
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="payload-block-slot" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </div>
    )
  }

  return null
}
