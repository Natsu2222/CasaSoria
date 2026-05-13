import Link from 'next/link'
import React from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const revalidate = 600

export default async function ProductsPage() {
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 48,
    overrideAccess: false,
    sort: '-updatedAt',
    select: {
      title: true,
      slug: true,
      shortDescription: true,
      price: true,
      availability: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-10">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Products</h1>
          <p>Browse our catalog. Reserve online, pick up and pay in store.</p>
        </div>
      </div>

      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.docs.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.slug}`}
              className="border border-border rounded-lg bg-card p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium truncate">{p.title}</div>
                  {p.shortDescription ? (
                    <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {p.shortDescription}
                    </div>
                  ) : null}
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-semibold">{formatEUR(p.price)}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {availabilityLabel(p.availability)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {products.totalDocs === 0 ? (
          <div className="mt-10 text-muted-foreground">No products yet.</div>
        ) : null}
      </div>
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
