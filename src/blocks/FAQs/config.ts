import type { Block } from 'payload'

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
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

import { fontFamilySelectField } from '@/fields/fontFamilySelect'

// Same TextStateFeature config as ServiciosSoria — gives editors quick access
// to common font weights from the floating toolbar.
const faqsTextState = {
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
      TextStateFeature({ state: faqsTextState }),
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
      UnorderedListFeature(),
      LinkFeature({ enabledCollections: ['pages', 'posts'] }),
      TextStateFeature({ state: faqsTextState }),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  })

export const FAQsBlock: Block = {
  slug: 'faqs',
  interfaceName: 'FAQsBlock',
  labels: {
    singular: 'FAQs',
    plural: 'FAQs',
  },
  fields: [
    // ─── Header ─────────────────────────────────────────────────────────
    {
      name: 'anchorId',
      type: 'text',
      label: 'ID ancla',
      admin: {
        description: 'ID opcional para enlaces ancla (ej: preguntas-frecuentes).',
      },
    },
    {
      name: 'title',
      type: 'richText',
      label: 'Título',
      editor: headlineEditor(),
      admin: {
        description: 'Encabezado principal del bloque (ej: "Preguntas frecuentes").',
      },
    },
    {
      name: 'subtitle',
      type: 'richText',
      label: 'Subtítulo',
      editor: bodyEditor(),
      admin: {
        description: 'Texto breve bajo el título.',
      },
    },

    // ─── Items ──────────────────────────────────────────────────────────
    {
      name: 'items',
      type: 'array',
      label: 'Preguntas',
      minRows: 1,
      labels: { singular: 'Pregunta', plural: 'Preguntas' },
      admin: {
        initCollapsed: false,
        description: 'Cada elemento es una pregunta con su respuesta desplegable.',
      },
      fields: [
        {
          name: 'question',
          type: 'richText',
          label: 'Pregunta',
          editor: bodyEditor(),
          required: true,
        },
        {
          name: 'answer',
          type: 'richText',
          label: 'Respuesta',
          editor: bodyEditor(),
          required: true,
        },
        {
          name: 'defaultOpen',
          type: 'checkbox',
          label: 'Abierta por defecto',
          defaultValue: false,
          admin: {
            description: 'Si está marcada, la pregunta se mostrará abierta al cargar la página.',
          },
        },
      ],
    },

    // ─── Behavior ───────────────────────────────────────────────────────
    {
      name: 'allowMultipleOpen',
      type: 'checkbox',
      label: 'Permitir varias abiertas a la vez',
      defaultValue: false,
      admin: {
        description:
          'Si está desactivado, al abrir una pregunta se cerrarán las demás (modo acordeón).',
      },
    },

    // ─── Appearance: section ─────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Apariencia — Sección',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'backgroundColor',
              type: 'text',
              label: 'Color de fondo de la sección',
              admin: {
                width: '50%',
                description: 'Cualquier color CSS (#hex, rgb, oklch...). Por defecto: negro.',
                placeholder: '#0a0a0a',
              },
            },
            {
              name: 'maxWidth',
              type: 'text',
              label: 'Ancho máximo del contenido',
              admin: {
                width: '50%',
                description: 'Por defecto: 64rem. Ej: 48rem, 800px, 100%.',
                placeholder: '64rem',
              },
            },
          ],
        },
      ],
    },

    // ─── Appearance: title + subtitle ────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Apariencia — Título y subtítulo',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'titleColor',
              type: 'text',
              label: 'Color del título',
              admin: {
                width: '50%',
                description: 'Por defecto: blanco.',
                placeholder: '#ffffff',
              },
            },
            fontFamilySelectField({
              name: 'titleFontFamily',
              label: 'Tipografía del título',
              width: '50%',
            }),
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'subtitleColor',
              type: 'text',
              label: 'Color del subtítulo',
              admin: {
                width: '50%',
                description: 'Por defecto: gris claro.',
                placeholder: '#cbd5e1',
              },
            },
            fontFamilySelectField({
              name: 'subtitleFontFamily',
              label: 'Tipografía del subtítulo',
              width: '50%',
            }),
          ],
        },
      ],
    },

    // ─── Appearance: cards (questions) ───────────────────────────────────
    {
      type: 'collapsible',
      label: 'Apariencia — Cajas de preguntas',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'cardBackgroundColor',
              type: 'text',
              label: 'Color de fondo de las cajas',
              admin: {
                width: '50%',
                description: 'Por defecto: blanco.',
                placeholder: '#ffffff',
              },
            },
            {
              name: 'cardBorderColor',
              type: 'text',
              label: 'Color del borde',
              admin: {
                width: '50%',
                description: 'Por defecto: transparente.',
                placeholder: 'transparent',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'questionColor',
              type: 'text',
              label: 'Color del texto de la pregunta',
              admin: {
                width: '50%',
                description: 'Por defecto: negro.',
                placeholder: '#0a0a0a',
              },
            },
            fontFamilySelectField({
              name: 'questionFontFamily',
              label: 'Tipografía de la pregunta',
              width: '50%',
            }),
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'answerColor',
              type: 'text',
              label: 'Color del texto de la respuesta',
              admin: {
                width: '50%',
                description: 'Por defecto: gris oscuro.',
                placeholder: '#475569',
              },
            },
            fontFamilySelectField({
              name: 'answerFontFamily',
              label: 'Tipografía de la respuesta',
              width: '50%',
            }),
          ],
        },
      ],
    },

    // ─── Appearance: toggle icon button ──────────────────────────────────
    {
      type: 'collapsible',
      label: 'Apariencia — Botón de abrir / cerrar',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'iconBackgroundColor',
              type: 'text',
              label: 'Color de fondo del botón',
              admin: {
                width: '50%',
                description: 'Por defecto: verde oscuro.',
                placeholder: '#0f4c3a',
              },
            },
            {
              name: 'iconColor',
              type: 'text',
              label: 'Color del icono',
              admin: {
                width: '50%',
                description: 'Por defecto: blanco.',
                placeholder: '#ffffff',
              },
            },
          ],
        },
      ],
    },
  ],
}
