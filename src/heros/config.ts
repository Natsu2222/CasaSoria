import type { Field, Validate } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

import { heroParallaxGroupField } from '@/heros/heroParallaxFields'
import { heroParallax2GroupField } from '@/heros/heroParallax2Fields'
import { heroParallax3GroupField } from '@/heros/heroParallax3Fields'
import { microVisualsGroupField } from '@/heros/microVisualsFields'
import { heroSoriaGroupField } from '@/heros/heroSoriaFields'

const customHeroTypes = [
  'microVisuals',
  'heroSoria',
  'heroParallax',
  'heroParallax2',
  'heroParallax3',
] as const

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
        {
          label: 'Hero Parallax',
          value: 'heroParallax',
        },
        {
          label: 'Hero Parallax 2',
          value: 'heroParallax2',
        },
        {
          label: 'Hero Parallax 3 (fondo imagen)',
          value: 'heroParallax3',
        },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      admin: {
        // Hide the legacy richText for hero types that bring their own copy fields.
        condition: (_, { type } = {}) => !customHeroTypes.includes(type),
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
          condition: (_, { type } = {}) => !customHeroTypes.includes(type),
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
    heroParallaxGroupField,
    heroParallax2GroupField,
    heroParallax3GroupField,
  ],
  label: false,
}
