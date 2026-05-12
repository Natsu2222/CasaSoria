import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'
import { slugField } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'sku', 'price', 'availability', 'updatedAt'],
    useAsTitle: 'title',
  },
  defaultPopulate: {
    title: true,
    slug: true,
    price: true,
    availability: true,
    images: true,
    shortDescription: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Product name',
    },
    {
      name: 'sku',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      index: true,
      label: 'SKU (optional)',
    },
    {
      name: 'price',
      type: 'number',
      min: 0,
      required: true,
      admin: {
        position: 'sidebar',
        step: 0.01,
      },
      label: 'Price (€)',
    },
    {
      name: 'availability',
      type: 'select',
      required: true,
      defaultValue: 'in_stock',
      admin: {
        position: 'sidebar',
      },
      options: [
        { label: 'In stock', value: 'in_stock' },
        { label: 'Limited stock', value: 'limited' },
        { label: 'Out of stock', value: 'out_of_stock' },
      ],
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      maxLength: 280,
      label: 'Short description',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Full description',
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Images',
    },
    {
      name: 'allowReservation',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
      label: 'Allow reservation from website',
    },
    slugField(),
  ],
  timestamps: true,
}

