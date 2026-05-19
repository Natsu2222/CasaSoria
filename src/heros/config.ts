import type { Field, Validate } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

import { microVisualsGroupField } from '@/heros/microVisualsFields'
import { heroSoriaGroupField } from '@/heros/heroSoriaFields'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
        {
          label: 'MicroVisuals (fullscreen)',
          value: 'microVisuals',
        },
        {
          label: 'Hero Soria (polaroids)',
          value: 'heroSoria',
        },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      admin: {
        // Hide the legacy richText for hero types that bring their own copy fields.
        condition: (_, { type } = {}) => !['microVisuals', 'heroSoria'].includes(type),
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
        admin: {
          condition: (_, { type } = {}) => !['microVisuals', 'heroSoria'].includes(type),
        },
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      validate: ((value, { siblingData }) => {
        const t = siblingData?.type
        if (t === 'highImpact' || t === 'mediumImpact') {
          if (!value) return 'Media is required for this hero type.'
        }
        return true
      }) satisfies Validate,
    },
    microVisualsGroupField,
    heroSoriaGroupField,
  ],
  label: false,
}
