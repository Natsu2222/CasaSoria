import React, { cache } from 'react'
import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { Media } from '@/components/Media'
import { ReserveForm } from './ReserveForm'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export const revalidate = 600

export default async function ProductPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/products/' + decodedSlug

  const product = await queryProductBySlug({ slug: decodedSlug })

  if (!product) {
    return <PayloadRedirects url={url} />
  }

  const disabled = product.allowReservation === false || product.availability === 'out_of_stock'

  return (
    <div className="pt-24 pb-24">
      <div className="container">
        <div className="mb-8">
          <div className="prose dark:prose-invert max-w-none">
            <h1 className="mb-2">{product.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{formatEUR(product.price)}</span>
            <span aria-hidden="true">•</span>
            <span>{availabilityLabel(product.availability)}</span>
            {product.sku ? (
              <>
                <span aria-hidden="true">•</span>
                <span>SKU: {product.sku}</span>
              </>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            {Array.isArray(product.images) && product.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {product.images.map((img, idx) => {
                  if (!img || typeof img === 'string') return null
                  return (
                    <div
                      className="border border-border rounded-lg overflow-hidden bg-card"
                      key={`${typeof img === 'number' ? img : img.id}-${idx}`}
                    >
                      <Media resource={img} size="50vw" />
                    </div>
                  )
                })}
              </div>
            ) : null}

            <div className="prose dark:prose-invert max-w-none mt-8">
              {product.shortDescription ? <p>{product.shortDescription}</p> : null}
            </div>
          </div>

          <div className="lg:col-span-5">
            <ReserveForm
              productID={String(product.id)}
              productTitle={product.title}
              disabled={disabled}
            />
            {disabled ? (
              <div className="text-sm text-muted-foreground mt-3">
                Reservations are currently disabled for this product.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const product = await queryProductBySlug({ slug: decodedSlug })

  if (!product) {
    return { title: 'Product not found' }
  }

  return {
    title: `${product.title} | Casa Soria`,
    description: product.shortDescription || undefined,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const products = await payload.find({
    collection: 'products',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return products.docs
    .filter((doc) => Boolean(doc.slug))
    .map((doc) => ({
      slug: doc.slug as string,
    }))
}

const queryProductBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    depth: 2,
    where: {
      slug: { equals: slug },
    },
  })

  return result.docs?.[0] || null
})

function formatEUR(value: unknown) {
  if (typeof value !== 'number') return '—'
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value)
}

function availabilityLabel(value: unknown) {
  if (value === 'in_stock') return 'In stock'
  if (value === 'limited') return 'Limited stock'
  if (value === 'out_of_stock') return 'Out of stock'
  return '—'
}
