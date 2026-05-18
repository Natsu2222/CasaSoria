import Link from 'next/link'
import React from 'react'

import type { Media, Product, ProductsBlock as ProductsBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import RichText from '@/components/RichText'

import { ProductsCarousel } from './ProductsCarousel'

type ProductCard = Pick<
  Product,
  'id' | 'title' | 'slug' | 'shortDescription' | 'price' | 'availability' | 'images'
>

export const ProductsBlock: React.FC<
  ProductsBlockProps & {
    id?: string
  }
> = async (props) => {
  const {
    id,
    title,
    description,
    populateBy,
    limit: limitFromProps,
    selectedProducts,
    carousel,
  } = props

  const limit = limitFromProps || 12

  let products: ProductCard[] = []

  const payload = await getPayload({ config: configPromise })

  if (populateBy === 'selection') {
    const selected = selectedProducts || []
    const hydrated = selected
      .filter((p): p is Product => typeof p === 'object' && p !== null)
      .map(toProductCard)
    const ids = selected.filter((p): p is number => typeof p === 'number')

    if (ids.length) {
      const fetched = await payload.find({
        collection: 'products',
        depth: 1,
        limit: ids.length,
        overrideAccess: false,
        select: {
          title: true,
          slug: true,
          shortDescription: true,
          price: true,
          availability: true,
          images: true,
        },
        where: {
          id: { in: ids },
        },
      })
      products = [...hydrated, ...(fetched.docs as ProductCard[])]
    } else {
      products = hydrated
    }
  } else {
    const fetched = await payload.find({
      collection: 'products',
      depth: 1,
      limit,
      overrideAccess: false,
      sort: '-updatedAt',
      select: {
        title: true,
        slug: true,
        shortDescription: true,
        price: true,
        availability: true,
        images: true,
      },
    })

    products = fetched.docs as ProductCard[]
  }

  return (
    <section id={`block-${id}`} className="container">
      <header className="relative max-w-3xl">
        <div className="payload-block-display text-3xl tracking-tight text-[var(--payload-block-ink)] md:text-4xl">
          {title ? <RichText className="payload-block-prose mb-0 max-w-none !text-inherit" data={title} enableGutter={false} /> : null}
        </div>
        {description ? (
          <div className="payload-block-prose mt-5 max-w-2xl text-[color-mix(in_oklch,var(--muted-foreground)_88%,var(--payload-block-ink))]">
            <RichText className="mb-0" data={description} enableGutter={false} />
          </div>
        ) : null}
        <div className="mt-10 h-px max-w-[min(20rem,70vw)] bg-[linear-gradient(90deg,var(--payload-block-accent),transparent)] opacity-90" />
      </header>

      {carousel ? (
        <ProductsCarousel products={products} />
      ) : (
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-[1.35rem] bg-[color-mix(in_oklch,var(--payload-block-paper)_92%,transparent)] shadow-[var(--payload-block-shadow)] ring-1 ring-[var(--payload-block-ring)] transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_32px_72px_-38px_oklch(22%_0.06_48deg_/_0.42)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--payload-block-accent)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                {getFirstProductImage(p) ? (
                  <img
                    src={getFirstProductImage(p)!.url || undefined}
                    alt={getFirstProductImage(p)!.alt || p.title}
                    className="h-full w-full object-cover transition-[transform,filter] duration-[900ms] ease-out group-hover:scale-[1.04] group-hover:brightness-[1.03]"
                    loading="lazy"
                  />
                ) : (
                  <div className="payload-block-display flex h-full items-center justify-center text-lg text-muted-foreground">
                    No image
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color-mix(in_oklch,var(--background)_55%,black)]/55 via-transparent to-[color-mix(in_oklch,var(--payload-block-accent)_22%,transparent)] opacity-80 transition-opacity duration-500 group-hover:opacity-95 dark:from-black/60" />
              </div>

              <div className="relative flex flex-1 flex-col gap-3 px-6 pb-7 pt-6">
                <div className="payload-block-display text-xl leading-snug text-[var(--payload-block-ink)] group-hover:text-[color-mix(in_oklch,var(--payload-block-ink)_75%,var(--payload-block-accent))] transition-colors duration-300 md:text-[1.35rem]">
                  {p.title}
                </div>
                {p.shortDescription ? (
                  <p className="payload-block-prose line-clamp-3 text-[0.98rem] leading-relaxed text-muted-foreground">{p.shortDescription}</p>
                ) : null}
                <div className="mt-auto flex items-end justify-between gap-4 border-t border-[color-mix(in_oklch,var(--border)_75%,transparent)] pt-5">
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    {availabilityLabel(p.availability)}
                  </span>
                  <span className="payload-block-display text-xl tabular-nums text-[var(--payload-block-accent)]">{formatEUR(p.price)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {products.length === 0 && !carousel ? (
        <p className="payload-block-prose mt-14 text-muted-foreground">No products yet.</p>
      ) : null}
    </section>
  )
}

function formatEUR(value: number | null | undefined) {
  if (typeof value !== 'number') return '—'
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value)
}

function availabilityLabel(value: unknown) {
  if (value === 'in_stock') return 'In stock'
  if (value === 'limited') return 'Limited'
  if (value === 'out_of_stock') return 'Out of stock'
  return '—'
}

function getFirstProductImage(product: ProductCard): Media | null {
  const first = product.images?.[0]
  if (!first || typeof first !== 'object') return null

  const url = first.sizes?.small?.url || first.sizes?.thumbnail?.url || first.url
  if (!url) return null

  return { ...first, url }
}

function toProductCard(product: Product): ProductCard {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    shortDescription: product.shortDescription,
    price: product.price,
    availability: product.availability,
    images: product.images,
  }
}

