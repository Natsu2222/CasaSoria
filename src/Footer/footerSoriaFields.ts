import type { Field } from 'payload'

import {
  BoldFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  ParagraphFeature,
  TextStateFeature,
  UnderlineFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { fontFamilySelectField } from '@/fields/fontFamilySelect'
import { link } from '@/fields/link'

const footerSoriaTextState = {
  weight: {
    light: { label: 'Light', css: { 'font-weight': '300' } },
    regular: { label: 'Regular', css: { 'font-weight': '400' } },
    medium: { label: 'Medium', css: { 'font-weight': '500' } },
    semibold: { label: 'Semibold', css: { 'font-weight': '600' } },
    heavy: { label: 'Heavy', css: { 'font-weight': '800' } },
  },
} as const

const labelEditor = () =>
  lexicalEditor({
    features: ({ rootFeatures }) => [
      ...rootFeatures,
      ParagraphFeature(),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      LinkFeature({ enabledCollections: ['pages', 'posts'] }),
      TextStateFeature({ state: footerSoriaTextState }),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  })

export const FOOTER_SORIA_ICON_OPTIONS = [
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'Correo', value: 'mail' },
  { label: 'Teléfono', value: 'phone' },
  { label: 'Enlace externo', value: 'external' },
] as const

export const footerSoriaGroupField: Field = {
  name: 'footerSoria',
  type: 'group',
  label: 'Footer Soria',
  admin: {
    condition: (_, { type } = {}) => type === 'footerSoria',
    hideGutter: true,
    description:
      'Footer minimalista con enlaces sociales, logotipo y barra legal inferior. Todos los textos son rich text para poder aplicar negrita, cursiva y subrayado.',
  },
  fields: [
    // ── Enlaces sociales / contacto ───────────────────────────────────────
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Enlaces sociales y contacto',
      labels: { singular: 'Enlace', plural: 'Enlaces' },
      maxRows: 12,
      admin: {
        initCollapsed: false,
        description:
          'Lista vertical con icono + texto. Se muestran separados por líneas finas, como en la referencia de diseño.',
        components: {
          RowLabel: '@/Footer/RowLabel#FooterSoriaSocialRowLabel',
        },
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          label: 'Icono',
          defaultValue: 'external',
          options: [...FOOTER_SORIA_ICON_OPTIONS],
        },
        {
          name: 'label',
          type: 'richText',
          editor: labelEditor(),
          label: 'Texto del enlace',
          required: true,
        },
        link({ appearances: false, disableLabel: true }),
      ],
    },

    // ── Marca / logotipo ──────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Logotipo (imagen)',
          admin: {
            width: '50%',
            description: 'Imagen del logotipo o isotipo. Se muestra junto al texto de marca.',
          },
          filterOptions: { mimeType: { contains: 'image' } },
        },
        {
          name: 'brandText',
          type: 'richText',
          editor: labelEditor(),
          label: 'Texto de marca',
          admin: {
            width: '50%',
            description:
              'Texto junto al logotipo. Usa negrita en una palabra y regular en otra, p. ej. "Senda" + "Health".',
          },
        },
      ],
    },
    {
      name: 'brandLink',
      type: 'group',
      label: 'Enlace del logotipo (opcional)',
      admin: {
        description: 'Por defecto enlaza a la página de inicio. Déjalo vacío para usar "/".',
      },
      fields: [link({ appearances: false })],
    },

    // ── Barra legal inferior ──────────────────────────────────────────────
    {
      name: 'legalLinks',
      type: 'array',
      label: 'Enlaces legales',
      labels: { singular: 'Enlace legal', plural: 'Enlaces legales' },
      maxRows: 8,
      admin: {
        initCollapsed: true,
        description: 'Enlaces del pie inferior (Aviso legal, Privacidad, Cookies…).',
        components: {
          RowLabel: '@/Footer/RowLabel#FooterSoriaLegalRowLabel',
        },
      },
      fields: [
        {
          name: 'label',
          type: 'richText',
          editor: labelEditor(),
          label: 'Texto del enlace',
          required: true,
        },
        link({ appearances: false, disableLabel: true }),
      ],
    },
    {
      name: 'copyright',
      type: 'richText',
      editor: labelEditor(),
      label: 'Copyright',
      admin: {
        description: 'Texto de derechos de autor en la esquina inferior derecha.',
      },
    },

    // ── Apariencia ────────────────────────────────────────────────────────
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
                description: 'Opcional. Cualquier color CSS (#hex, rgb, oklch…).',
                placeholder: '#f5f2eb',
              },
            },
            {
              name: 'textColor',
              type: 'text',
              label: 'Color del texto',
              admin: {
                width: '50%',
                description: 'Aplica a textos, iconos y enlaces.',
                placeholder: '#1a1a1a',
              },
            },
          ],
        },
        fontFamilySelectField({
          name: 'fontFamily',
          label: 'Tipografía',
          description: 'Tipografía base del footer. Por defecto usa la del sitio.',
        }),
      ],
    },
  ],
}
