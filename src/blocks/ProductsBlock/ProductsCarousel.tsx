'use client'

import Link from 'next/link'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import type { Media, Product } from '@/payload-types'
import { cn } from '@/utilities/ui'

type ProductCard = Pick<
  Product,
  'id' | 'title' | 'slug' | 'shortDescription' | 'price' | 'availability' | 'images'
>

type Props = {
  products: ProductCard[]
}

/**
 * Carrusel horizontal con scroll snapping para los productos. Reutiliza el
 * mismo card visual que el modo "grid" del bloque para que el cambio entre
 * ambos modos sea puramente de layout.
 */
export const ProductsCarousel: React.FC<Props> = ({ products }) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const updateScrollState = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollPrev(scrollLeft > 2)
    setCanScrollNext(scrollLeft + clientWidth < scrollWidth - 2)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    const ro = new ResizeObserver(updateScrollState)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      ro.disconnect()
    }
  }, [updateScrollState])

  const scrollBy = useCallback((direction: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    // Avanzamos aproximadamente una "página" de cards. Tomamos el ancho del
    // primer hijo como referencia para mantener el snapping coherente.
    const firstCard = el.querySelector<HTMLElement>('[data-product-card]')
    const step = firstCard ? firstCard.clientWidth + 24 : el.clientWidth * 0.8
    el.scrollBy({ left: step * direction, behavior: 'smooth' })
  }, [])

  if (products.length === 0) {
    return <p className="payload-block-prose mt-14 text-muted-foreground">No products yet.</p>
  }

  return (
    <div className="relative mt-14">
      <div
        ref={trackRef}
        className={cn(
          'flex gap-6 overflow-x-auto scroll-smooth pb-4 lg:gap-8',
          'snap-x snap-mandatory',
          // Padding lateral para que la primera/última card no queden pegadas
          // al borde y para evitar el corte en el snap.
          'px-1 sm:px-2',
          // Ocultar la scrollbar nativa: los controles laterales actúan como UI.
          '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
        )}
        aria-label="Carrusel de productos"
      >
        {products.map((p) => (
          <Link
            key={p.id}
            data-product-card
            href={`/products/${p.slug}`}
            className={cn(
              'group relative flex shrink-0 snap-start flex-col overflow-hidden rounded-[1.35rem]',
              'bg-[color-mix(in_oklch,var(--payload-block-paper)_92%,transparent)] shadow-[var(--payload-block-shadow)] ring-1 ring-[var(--payload-block-ring)]',
              'transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_32px_72px_-38px_oklch(22%_0.06_48deg_/_0.42)]',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--payload-block-accent)]',
              // Anchos responsive del card en modo carrusel. Mostramos ~1 en
              // móvil, ~2 en tablet y ~3 en desktop, dejando que la siguiente
              // card "asome" como pista visual de que el carrusel desliza.
              'w-[82vw] sm:w-[58vw] md:w-[44vw] lg:w-[32vw] xl:w-[28vw]',
            )}
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
                <p className="payload-block-prose line-clamp-3 text-[0.98rem] leading-relaxed text-muted-foreground">
                  {p.shortDescription}
                </p>
              ) : null}
              <div className="mt-auto flex items-end justify-between gap-4 border-t border-[color-mix(in_oklch,var(--border)_75%,transparent)] pt-5">
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  {availabilityLabel(p.availability)}
                </span>
                <span className="payload-block-display text-xl tabular-nums text-[var(--payload-block-accent)]">
                  {formatEUR(p.price)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Controles laterales — sólo aparecen cuando hay overflow real. */}
      {(canScrollPrev || canScrollNext) && (
        <>
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            disabled={!canScrollPrev}
            aria-label="Producto anterior"
            className={cn(
              'absolute left-2 top-1/2 z-10 -translate-y-1/2 hidden md:flex',
              'size-11 items-center justify-center rounded-full',
              'bg-[color-mix(in_oklch,var(--payload-block-paper)_94%,transparent)] backdrop-blur-md',
              'ring-1 ring-[var(--payload-block-ring)] shadow-[var(--payload-block-shadow)]',
              'text-[var(--payload-block-ink)] transition-[transform,opacity] duration-300',
              'hover:scale-[1.05] active:scale-[0.97]',
              'disabled:pointer-events-none disabled:opacity-0',
            )}
          >
            <ChevronLeft className="size-5" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            disabled={!canScrollNext}
            aria-label="Producto siguiente"
            className={cn(
              'absolute right-2 top-1/2 z-10 -translate-y-1/2 hidden md:flex',
              'size-11 items-center justify-center rounded-full',
              'bg-[color-mix(in_oklch,var(--payload-block-paper)_94%,transparent)] backdrop-blur-md',
              'ring-1 ring-[var(--payload-block-ring)] shadow-[var(--payload-block-shadow)]',
              'text-[var(--payload-block-ink)] transition-[transform,opacity] duration-300',
              'hover:scale-[1.05] active:scale-[0.97]',
              'disabled:pointer-events-none disabled:opacity-0',
            )}
          >
            <ChevronRight className="size-5" strokeWidth={2} />
          </button>
        </>
      )}
    </div>
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

export default ProductsCarousel
