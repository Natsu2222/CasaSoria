import type { Field } from 'payload'

import { link } from '@/fields/link'

const microVideoValidate = (
  value: unknown,
  { data }: { data?: { hero?: { type?: string; microVisuals?: { videoUrl?: string | null } } } },
) => {
  if (data?.hero?.type !== 'microVisuals') return true
  const override = data.hero.microVisuals?.videoUrl?.trim() ?? ''
  if (override.length > 0) return true
  if (!value) return 'Upload a video file or paste an external video URL.'
  return true
}

export const microVisualsGroupField: Field = {
  name: 'microVisuals',
  type: 'group',
  label: 'MicroVisuals',
  admin: {
    condition: (_, { type } = {}) => type === 'microVisuals',
    hideGutter: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Headline',
      defaultValue: 'MicroVisuals',
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Video URL (optional)',
      admin: {
        description:
          'External MP4 URL (e.g. CDN). If set, this overrides the uploaded file below.',
      },
    },
    {
      name: 'backgroundVideo',
      type: 'upload',
      relationTo: 'media',
      label: 'Background video (upload)',
      admin: {
        description: 'MP4 recommended. Used when Video URL is empty.',
      },
      filterOptions: {
        mimeType: { contains: 'video' },
      },
      validate: microVideoValidate,
    },
    {
      name: 'navItems',
      type: 'array',
      labels: { singular: 'Nav link', plural: 'Nav links' },
      admin: { initCollapsed: true },
      maxRows: 12,
      fields: [
        link({
          appearances: false,
        }),
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'leftCaption',
          type: 'textarea',
          label: 'Bottom left caption',
          admin: { width: '50%' },
          defaultValue:
            "Forma's AI understands context, composition, and style like a creative director would.",
        },
        {
          name: 'rightCaption',
          type: 'textarea',
          label: 'Bottom right caption',
          admin: { width: '50%' },
          defaultValue:
            'Describe what you see in your head — get images that actually match.',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        link({
          appearances: false,
          overrides: {
            name: 'signIn',
            label: 'Productos',
            admin: { width: '50%' },
          },
        }),
        link({
          appearances: false,
          overrides: {
            name: 'tryItFree',
            label: 'Presupuesto',
            admin: { width: '50%' },
          },
        }),
      ],
    },
    {
      type: 'row',
      fields: [
        link({
          appearances: false,
          overrides: {
            name: 'primaryCta',
            label: 'Primary button (e.g. Start generating)',
            admin: { width: '50%' },
          },
        }),
        link({
          appearances: false,
          overrides: {
            name: 'secondaryCta',
            label: 'Secondary button (e.g. See templates)',
            admin: { width: '50%' },
          },
        }),
      ],
    },
    {
      name: 'showSecondaryIcon',
      type: 'checkbox',
      label: 'Show templates icon on secondary button',
      defaultValue: true,
    },
  ],
}
