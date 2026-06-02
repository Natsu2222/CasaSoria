import React from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CasosExitoBlock } from '@/blocks/CasosExito/Component'
import { CasosExitoGridsBlock } from '@/blocks/CasosExitoGrids/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { CTAClientesBlockComponent } from '@/blocks/CTAClientes/Component'
import { CtaParallaxBlock } from '@/blocks/CTAParallax/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FAQsBlock } from '@/blocks/FAQs/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { LayoutSoriaBlock } from '@/blocks/LayoutSoria/Component'
import { LayoutSoria2Block } from '@/blocks/LayoutSoria2/Component'
import { LayoutSupportBlock } from '@/blocks/LayoutSupport/Component'
import { LocationBlock } from '@/blocks/LocationBlock/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { ProductsBlock } from '@/blocks/ProductsBlock/Component'
import { ServicesGridBlock } from '@/blocks/ServiciosGrid/Component'
import { ServiciosSoriaBlock } from '@/blocks/ServiciosSoria/Component'
import { TestimonialsBlock } from '@/blocks/Testimonials/Component'

const blockComponents = {
  archive: ArchiveBlock,
  casosExito: CasosExitoBlock,
  casosExitoGrids: CasosExitoGridsBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  ctaClientes: CTAClientesBlockComponent,
  ctaParallax: CtaParallaxBlock,
  faqs: FAQsBlock,
  formBlock: FormBlock,
  layoutSoria: LayoutSoriaBlock,
  layoutSoria2: LayoutSoria2Block,
  layoutSupport: LayoutSupportBlock,
  locationBlock: LocationBlock,
  mediaBlock: MediaBlock,
  productsBlock: ProductsBlock,
  serviciosSoria: ServiciosSoriaBlock,
  servicesGrid: ServicesGridBlock,
  testimonials: TestimonialsBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <div className="payload-blocks-root flex flex-col" data-payload-blocks="">
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              const isFullBleed = blockType === 'ctaParallax'

              return (
                <div
                  className={isFullBleed ? 'payload-block-slot payload-block-slot--bleed' : 'payload-block-slot'}
                  key={index}
                >
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
