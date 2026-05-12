import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '../../fields/linkGroup'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  fields: [
    {
      name: 'background',
      type: 'group',
      fields: [
        {
          name: 'type',
          type: 'select',
          defaultValue: 'none',
          options: [
            { label: 'None (default)', value: 'none' },
            { label: 'Background image', value: 'image' },
            { label: 'Background video', value: 'video' },
            { label: 'Solid color', value: 'solid' },
            { label: 'Gradient (two colors)', value: 'gradient' },
          ],
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'image',
          },
        },
        {
          name: 'videoURL',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'video',
            placeholder: 'https://www.youtube.com/watch?v=...',
            description: 'HTTPS URL to YouTube (or other allowed secure providers).',
          },
          validate: (value: unknown) => {
            if (!value) return true
            if (typeof value !== 'string') return 'Invalid URL'
            let url: URL
            try {
              url = new URL(value)
            } catch {
              return 'Please enter a valid URL'
            }
            if (url.protocol !== 'https:') return 'URL must start with https://'

            const host = url.hostname.toLowerCase()
            const allowedHosts = new Set([
              'youtube.com',
              'www.youtube.com',
              'm.youtube.com',
              'youtu.be',
              'youtube-nocookie.com',
              'www.youtube-nocookie.com',
              'player.vimeo.com',
              'vimeo.com',
              'www.vimeo.com',
            ])

            if (!allowedHosts.has(host)) {
              return 'Only YouTube / Vimeo secure URLs are allowed'
            }
            return true
          },
        },
        {
          name: 'solidColor',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'solid',
            placeholder: '#0f172a',
            description: 'CSS color value (e.g. #0f172a, rgb(...), hsl(...))',
          },
        },
        {
          name: 'gradientFrom',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'gradient',
            placeholder: '#0f172a',
          },
        },
        {
          name: 'gradientTo',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'gradient',
            placeholder: '#1d4ed8',
          },
        },
        {
          name: 'overlayOpacity',
          type: 'number',
          min: 0,
          max: 1,
          defaultValue: 0.35,
          admin: {
            step: 0.05,
            condition: (_, siblingData) =>
              siblingData?.type === 'image' || siblingData?.type === 'video',
            description:
              'Optional dark overlay to improve text contrast (0–1). Applies to image/video backgrounds.',
          },
        },
      ],
    },
    {
      name: 'buttonsPosition',
      type: 'select',
      defaultValue: 'right',
      options: [
        { label: 'Right (default)', value: 'right' },
        { label: 'Left', value: 'left' },
        { label: 'Bottom', value: 'bottom' },
      ],
      admin: {
        description: 'Where the CTA buttons appear on desktop layouts.',
      },
    },
    {
      name: 'richText',
      type: 'richText',
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
      appearances: ['default', 'outline'],
      overrides: {
        maxRows: 2,
      },
    }),
  ],
  labels: {
    plural: 'Calls to Action',
    singular: 'Call to Action',
  },
}
