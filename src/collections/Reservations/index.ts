import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'

export const Reservations: CollectionConfig = {
  slug: 'reservations',
  access: {
    create: anyone,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['product', 'status', 'fullName', 'mobile', 'email', 'createdAt'],
    useAsTitle: 'fullName',
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      index: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Ready for pickup', value: 'ready' },
        { label: 'Collected / Paid in store', value: 'collected' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'fullName',
      type: 'text',
      required: true,
      label: 'Full name',
    },
    {
      name: 'mobile',
      type: 'text',
      required: true,
      label: 'Mobile number',
      validate: (value: unknown) => {
        if (typeof value !== 'string') return 'Mobile number is required'
        const v = value.trim()
        if (v.length < 7) return 'Mobile number looks too short'
        if (v.length > 20) return 'Mobile number looks too long'
        return true
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email',
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Message (optional)',
      maxLength: 1000,
    },
  ],
  timestamps: true,
}

