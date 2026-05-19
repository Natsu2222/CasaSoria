import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { fontFamilySelectField } from '@/fields/fontFamilySelect'

export const ProductsBlock: Block = {
  slug: 'productsBlock',
  interfaceName: 'ProductsBlock',
  labels: {
    plural: 'Products Blocks',
    singular: 'Products Block',
  },
  fields: [
    {
      name: 'title',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: 'Title',
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: 'Description',
    },
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'collection',
      options: [
        { label: 'Collection', value: 'collection' },
        { label: 'Manual selection', value: 'selection' },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        step: 1,
      },
      defaultValue: 12,
      label: 'Limit',
      min: 1,
    },
    {
      name: 'selectedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'selection',
      },
      label: 'Products',
    },
    {
      name: 'carousel',
      type: 'checkbox',
      defaultValue: false,
      label: 'Mostrar como carrusel',
      admin: {
        description:
          'Si está activado, los productos se muestran en un carrusel horizontal en lugar de la cuadrícula apilada.',
      },
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
              label: 'Color de texto principal',
              admin: {
                width: '50%',
                description:
                  'Opcional. Color base del título, descripción y tarjetas. Ej.: #1a1a1a',
                placeholder: '#1a1a1a',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            fontFamilySelectField({
              name: 'titleFontFamily',
              label: 'Tipografía del título',
              width: '50%',
              description: 'Por defecto usa la tipografía editorial del bloque.',
            }),
            fontFamilySelectField({
              name: 'descriptionFontFamily',
              label: 'Tipografía de la descripción',
              width: '50%',
              description: 'Tipografía aplicada al texto descriptivo y a las tarjetas de producto.',
            }),
          ],
        },
      ],
    },
  ],
}

