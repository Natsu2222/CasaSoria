import type { Block } from 'payload'

import {
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  ParagraphFeature,
  UnderlineFeature,
} from '@payloadcms/richtext-lexical'

const FONT_OPTIONS = [
  { label: 'Montserrat (por defecto)', value: 'Montserrat, sans-serif' },
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Lato', value: 'Lato, sans-serif' },
  { label: 'Open Sans', value: 'Open Sans, sans-serif' },
  { label: 'Raleway', value: 'Raleway, sans-serif' },
  { label: 'Poppins', value: 'Poppins, sans-serif' },
  { label: 'Playfair Display', value: 'Playfair Display, serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
]

const headlineEditor = () =>
  lexicalEditor({
    features: ({ rootFeatures }) => [
      ...rootFeatures,
      ParagraphFeature(),
      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  })

export const CtaParallaxBlock: Block = {
  slug: 'ctaParallax',
  interfaceName: 'CtaParallaxBlock',
  labels: {
    singular: 'CTA Parallax',
    plural: 'CTAs Parallax',
  },
  fields: [
    {
      name: 'heading',
      type: 'richText',
      label: 'Título',
      editor: headlineEditor(),
      admin: {
        description:
          'Ej: "Un problema, una solución\\nNosotros te asesoramos". Soporta saltos de línea y formato enriquecido.',
      },
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Botón CTA',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Texto del botón',
          defaultValue: 'CUÉNTANOS',
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL de destino',
          defaultValue: '/hablemos/',
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          label: 'Abrir en nueva pestaña',
          defaultValue: false,
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Fondo parallax',
      fields: [
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagen de fondo',
          required: true,
          admin: {
            description:
              'Imagen grande recomendada (mín. 1920px de ancho). ' +
              'Se fija al viewport mientras el usuario hace scroll — efecto parallax CSS.',
          },
        },
        {
          name: 'backgroundPosition',
          type: 'select',
          label: 'Posición del fondo',
          defaultValue: 'center center',
          options: [
            { label: 'Centro (por defecto)', value: 'center center' },
            { label: 'Arriba', value: 'center top' },
            { label: 'Abajo', value: 'center bottom' },
            { label: 'Izquierda', value: 'left center' },
            { label: 'Derecha', value: 'right center' },
          ],
        },
        {
          name: 'overlayColor',
          type: 'text',
          label: 'Overlay sobre la imagen (opcional)',
          admin: {
            description:
              'Capa de color semitransparente encima del fondo. ' +
              'Ej: rgba(0,0,0,0.4) para oscurecer. Dejar vacío para sin overlay.',
          },
        },
        {
          name: 'disableParallaxOnTouch',
          type: 'checkbox',
          label: 'Desactivar parallax en dispositivos táctiles (iOS/Android)',
          defaultValue: true,
          admin: {
            description:
              'background-attachment:fixed tiene bugs en iOS Safari. ' +
              'Al activar esta opción, en dispositivos táctiles el fondo será scroll normal.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Layout y espaciado',
      fields: [
        {
          name: 'textColumns',
          type: 'select',
          label: 'Ancho del bloque de texto',
          defaultValue: '9',
          options: [
            { label: '75% texto / 25% botón (por defecto Minery)', value: '9' },
            { label: '66% texto / 33% botón', value: '8' },
            { label: '50% texto / 50% botón', value: '6' },
          ],
          admin: {
            description: 'En columnas Bootstrap (sobre 12). El botón ocupa el resto.',
          },
        },
        {
          name: 'paddingY',
          type: 'select',
          label: 'Padding vertical',
          defaultValue: '90',
          options: [
            { label: '60px', value: '60' },
            { label: '90px (por defecto Minery)', value: '90' },
            { label: '120px', value: '120' },
            { label: '160px', value: '160' },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Tipografía',
      fields: [
        {
          name: 'headingFont',
          type: 'select',
          label: 'Fuente del título',
          defaultValue: 'Montserrat, sans-serif',
          options: FONT_OPTIONS,
        },
        {
          name: 'headingSize',
          type: 'select',
          label: 'Tamaño del título',
          defaultValue: '40',
          options: [
            { label: '30px', value: '30' },
            { label: '36px', value: '36' },
            { label: '40px (por defecto Minery)', value: '40' },
            { label: '45px', value: '45' },
            { label: '50px', value: '50' },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Colores',
      fields: [
        {
          name: 'headingColor',
          type: 'text',
          label: 'Color del título',
          defaultValue: '#1e1e1c',
          admin: { description: 'Color hex o CSS.' },
        },
        {
          name: 'buttonFillColor',
          type: 'text',
          label: 'Color del sweep fill del botón (hover)',
          defaultValue: '#f3f3f3',
          admin: {
            description:
              'Color con el que se rellena el botón al hacer hover. ' +
              'Por defecto blanco-web (#f3f3f3) como en Minery.',
          },
        },
      ],
    },
  ],
}
