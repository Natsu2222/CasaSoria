import type { Field } from 'payload'

import {
  AlignFeature,
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  ParagraphFeature,
  TextStateFeature,
  UnderlineFeature,
} from '@payloadcms/richtext-lexical'

import { fontFamilySelectField } from '@/fields/fontFamilySelect'
import { link } from '@/fields/link'

// Reusable rich-text state options aligned with the MicroVisuals look so the
// admin can pick the same weights from any text field in the hero.
const heroSoriaTextState = {
  weight: {
    light: { label: 'Light', css: { 'font-weight': '300' } },
    regular: { label: 'Regular', css: { 'font-weight': '400' } },
    medium: { label: 'Medium', css: { 'font-weight': '500' } },
    semibold: { label: 'Semibold', css: { 'font-weight': '600' } },
    heavy: { label: 'Heavy', css: { 'font-weight': '800' } },
  },
} as const

const headlineEditor = () =>
  lexicalEditor({
    features: ({ rootFeatures }) => [
      ...rootFeatures,
      ParagraphFeature(),
      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3'] }),
      AlignFeature(),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      TextStateFeature({ state: heroSoriaTextState }),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  })

const bodyEditor = () =>
  lexicalEditor({
    features: ({ rootFeatures }) => [
      ...rootFeatures,
      ParagraphFeature(),
      AlignFeature(),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      LinkFeature({ enabledCollections: ['pages', 'posts'] }),
      TextStateFeature({ state: heroSoriaTextState }),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  })

const eyebrowEditor = () =>
  lexicalEditor({
    features: () => [
      ParagraphFeature(),
      BoldFeature(),
      ItalicFeature(),
      TextStateFeature({ state: heroSoriaTextState }),
      InlineToolbarFeature(),
    ],
  })

// ─────────────────────────────────────────────────────────────────────────────
// Hero Soria — group of fields shown when `type === 'heroSoria'`.
// Mirrors the design in the reference recording: a centered headline + small
// subtitle, then a row of polaroid-tilted cards, with up to two CTA buttons.
// Every text block is rich-text so editors can pick weight / italic / bold
// per fragment; colors and font families are configurable here at the block
// level for the broader look.
// ─────────────────────────────────────────────────────────────────────────────

export const heroSoriaGroupField: Field = {
  name: 'heroSoria',
  type: 'group',
  label: 'Hero Soria',
  admin: {
    condition: (_, { type } = {}) => type === 'heroSoria',
    hideGutter: true,
  },
  fields: [
    // ── Copy ──────────────────────────────────────────────────────────────
    {
      name: 'eyebrow',
      type: 'richText',
      editor: eyebrowEditor(),
      label: 'Eyebrow (texto pequeño sobre el título)',
      admin: {
        description: 'Opcional. Línea breve sobre el título principal.',
      },
    },
    {
      name: 'title',
      type: 'richText',
      editor: headlineEditor(),
      label: 'Título',
      admin: {
        description:
          'Encabezado principal. Por defecto se renderiza con el mismo estilo display que MicroVisuals.',
      },
    },
    {
      name: 'subtitle',
      type: 'richText',
      editor: bodyEditor(),
      label: 'Subtítulo',
      admin: {
        description: 'Texto descriptivo bajo el título.',
      },
    },

    // ── Buttons (max 2) ───────────────────────────────────────────────────
    {
      name: 'buttons',
      type: 'array',
      label: 'Botones (máx. 2)',
      labels: { singular: 'Botón', plural: 'Botones' },
      maxRows: 2,
      admin: {
        initCollapsed: false,
        description:
          'Hasta dos botones bajo el subtítulo. Cada botón es un link normal de Payload (puede apuntar a una página interna o a una URL externa).',
      },
      fields: [
        link({ appearances: false }),
        {
          type: 'row',
          fields: [
            {
              name: 'appearance',
              type: 'select',
              label: 'Estilo',
              defaultValue: 'primary',
              admin: { width: '50%' },
              options: [
                { label: 'Primario (sólido)', value: 'primary' },
                { label: 'Secundario (outline / glass)', value: 'secondary' },
              ],
            },
            fontFamilySelectField({
              name: 'fontFamily',
              label: 'Tipografía del botón',
              width: '50%',
              description: 'Por defecto, la tipografía del cuerpo de texto del hero.',
            }),
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'backgroundColor',
              type: 'text',
              label: 'Color de fondo',
              admin: {
                width: '50%',
                description: 'Opcional. Ej.: #111111 o oklch(0.2 0 0).',
                placeholder: '#111111',
              },
            },
            {
              name: 'textColor',
              type: 'text',
              label: 'Color del texto',
              admin: {
                width: '50%',
                placeholder: '#ffffff',
              },
            },
          ],
        },
      ],
    },

    // ── Gallery (polaroid row) ────────────────────────────────────────────
    {
      name: 'gallery',
      type: 'array',
      label: 'Galería (tarjetas inclinadas)',
      labels: { singular: 'Tarjeta', plural: 'Tarjetas' },
      minRows: 1,
      maxRows: 8,
      admin: {
        initCollapsed: false,
        description:
          'Cada elemento es una "polaroid" mostrada en la fila bajo los botones. El orden importa: las tarjetas se inclinan automáticamente alternando ±, salvo que sobrescribas el ángulo.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Imagen',
          filterOptions: { mimeType: { contains: 'image' } },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'rotation',
              type: 'number',
              label: 'Rotación (grados)',
              min: -25,
              max: 25,
              admin: {
                width: '50%',
                step: 1,
                description:
                  'Opcional. Si lo dejas vacío, las tarjetas se inclinan alternando ±5° en función del orden.',
              },
            },
            {
              name: 'alt',
              type: 'text',
              label: 'Texto alternativo (accesibilidad)',
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },

    // ── Appearance: title ────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'titleColor',
          type: 'text',
          label: 'Color del título',
          admin: {
            width: '50%',
            description: 'Opcional. Cualquier color CSS (#hex, rgb, oklch…).',
            placeholder: '#0b1320',
          },
        },
        fontFamilySelectField({
          name: 'titleFontFamily',
          label: 'Tipografía del título',
          width: '50%',
          description: 'Por defecto usa el estilo display del hero MicroVisuals.',
        }),
      ],
    },

    // ── Appearance: subtitle ─────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'subtitleColor',
          type: 'text',
          label: 'Color del subtítulo',
          admin: {
            width: '50%',
            placeholder: '#5b6470',
          },
        },
        fontFamilySelectField({
          name: 'subtitleFontFamily',
          label: 'Tipografía del subtítulo',
          width: '50%',
          description: 'Por defecto usa el cuerpo de texto MicroVisuals (Barlow).',
        }),
      ],
    },

    // ── Appearance: eyebrow ──────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'eyebrowColor',
          type: 'text',
          label: 'Color del eyebrow',
          admin: { width: '50%' },
        },
        fontFamilySelectField({
          name: 'eyebrowFontFamily',
          label: 'Tipografía del eyebrow',
          width: '50%',
        }),
      ],
    },

    // ── Background ───────────────────────────────────────────────────────
    {
      name: 'backgroundColor',
      type: 'text',
      label: 'Color de fondo del hero',
      admin: {
        description:
          'Opcional. Por defecto, un degradado suave crema → blanco como en la referencia.',
        placeholder: '#f6f3ec',
      },
    },
  ],
}
