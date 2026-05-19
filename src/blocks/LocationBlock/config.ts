import type { Block } from 'payload'

import { fontFamilySelectField } from '@/fields/fontFamilySelect'

// Days of the week for opening hours. The values match schema.org DayOfWeek
// constants so we can pass them straight into JSON-LD without translation.
const DAYS_OF_WEEK = [
  { label: 'Monday', value: 'Monday' },
  { label: 'Tuesday', value: 'Tuesday' },
  { label: 'Wednesday', value: 'Wednesday' },
  { label: 'Thursday', value: 'Thursday' },
  { label: 'Friday', value: 'Friday' },
  { label: 'Saturday', value: 'Saturday' },
  { label: 'Sunday', value: 'Sunday' },
] as const

export const LocationBlock: Block = {
  slug: 'locationBlock',
  interfaceName: 'LocationBlock',
  labels: {
    singular: 'Location / Map',
    plural: 'Location / Map blocks',
  },
  fields: [
    {
      name: 'businessName',
      type: 'text',
      required: true,
      defaultValue: 'Casa Soria',
      admin: {
        description: 'Shown as the heading above the address and used as the business name in structured data.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 280,
      admin: {
        description: 'Short tagline shown under the heading (optional).',
      },
    },
    {
      type: 'group',
      name: 'address',
      label: 'Address',
      fields: [
        {
          name: 'streetAddress',
          type: 'text',
          required: true,
          label: 'Street address',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'postalCode',
              type: 'text',
              required: true,
              label: 'Postal code',
              admin: { width: '30%' },
            },
            {
              name: 'addressLocality',
              type: 'text',
              required: true,
              label: 'City / Town',
              admin: { width: '40%' },
            },
            {
              name: 'addressRegion',
              type: 'text',
              label: 'Province',
              admin: { width: '30%' },
            },
          ],
        },
        {
          name: 'addressCountry',
          type: 'text',
          required: true,
          defaultValue: 'ES',
          label: 'Country code (ISO 3166-1 alpha-2)',
          admin: {
            description: 'Two-letter country code, e.g. ES for Spain.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'phone',
          type: 'text',
          required: true,
          label: 'Phone',
          admin: {
            width: '50%',
            description: 'In international format, e.g. +34 912 345 678',
          },
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email (optional)',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'embedUrl',
      type: 'text',
      required: true,
      label: 'Google Maps embed URL',
      admin: {
        description:
          'On Google Maps: open your business → Share → "Embed a map" → copy the URL from the src="..." attribute. Must start with https://www.google.com/maps/embed.',
      },
      validate: (value: unknown) => {
        if (typeof value !== 'string' || value.trim().length === 0) {
          return 'Embed URL is required'
        }
        if (!value.startsWith('https://www.google.com/maps/embed')) {
          return 'URL must start with https://www.google.com/maps/embed (use the src from the iframe code Google gives you)'
        }
        return true
      },
    },
    {
      type: 'group',
      name: 'geo',
      label: 'Geo coordinates (optional, improves SEO)',
      admin: {
        description:
          'Find your business in Google Maps, right-click the pin, click the coordinates to copy them, and paste here.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'latitude',
              type: 'number',
              label: 'Latitude',
              admin: { width: '50%', step: 0.000001 },
            },
            {
              name: 'longitude',
              type: 'number',
              label: 'Longitude',
              admin: { width: '50%', step: 0.000001 },
            },
          ],
        },
      ],
    },
    {
      name: 'openingHours',
      type: 'array',
      label: 'Opening hours',
      admin: {
        description:
          'Add one entry per continuous time range. For split schedules (e.g. mornings + afternoons) add two entries with the same days.',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'daysOfWeek',
          type: 'select',
          hasMany: true,
          required: true,
          options: [...DAYS_OF_WEEK],
          label: 'Days',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'opens',
              type: 'text',
              label: 'Opens (HH:MM, 24h)',
              admin: { width: '40%', placeholder: '09:00' },
              validate: validateTime,
            },
            {
              name: 'closes',
              type: 'text',
              label: 'Closes (HH:MM, 24h)',
              admin: { width: '40%', placeholder: '13:30' },
              validate: validateTime,
            },
            {
              name: 'closed',
              type: 'checkbox',
              label: 'Closed',
              defaultValue: false,
              admin: {
                width: '20%',
                description: 'Tick if these days are closed all day.',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'priceRange',
      type: 'select',
      label: 'Price range (optional)',
      admin: {
        description: 'Hint shown to Google for local listings. Not displayed on the page.',
      },
      options: [
        { label: '€  (budget)', value: '€' },
        { label: '€€ (mid-range)', value: '€€' },
        { label: '€€€ (premium)', value: '€€€' },
      ],
    },

    // ── Apariencia (color de fondo + tipografías) ────────────────────────────
    {
      type: 'collapsible',
      label: 'Apariencia',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'backgroundColor',
              type: 'text',
              label: 'Color de fondo',
              admin: {
                width: '50%',
                description:
                  'Opcional. Cualquier color CSS válido (#hex, rgb, oklch...). Ej.: #f6f3ec',
                placeholder: '#f6f3ec',
              },
            },
            {
              name: 'textColor',
              type: 'text',
              label: 'Color de texto',
              admin: {
                width: '50%',
                description:
                  'Opcional. Color base aplicado al título y al texto de la dirección. Ej.: #1a1a1a',
                placeholder: '#1a1a1a',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            fontFamilySelectField({
              name: 'headingFontFamily',
              label: 'Tipografía del título',
              width: '50%',
              description: 'Aplica al nombre del negocio.',
            }),
            fontFamilySelectField({
              name: 'bodyFontFamily',
              label: 'Tipografía del texto',
              width: '50%',
              description: 'Aplica a la descripción, dirección, teléfono y horarios.',
            }),
          ],
        },
      ],
    },
  ],
}

function validateTime(value: unknown) {
  if (value === undefined || value === null || value === '') return true
  if (typeof value !== 'string') return 'Use HH:MM (24h)'
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return 'Use HH:MM (24h), e.g. 09:00 or 16:30'
  return true
}
