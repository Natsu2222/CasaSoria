import type { Block } from 'payload'

import {
  BoldFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
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

const quoteEditor = () =>
  lexicalEditor({
    features: ({ rootFeatures }) => [
      ...rootFeatures,
      ParagraphFeature(),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      LinkFeature({ enabledCollections: ['pages', 'posts'] }),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  })

export const TestimonialsMineryBlock: Block = {
  slug: 'testimonialsMinery',
  interfaceName: 'TestimonialsMineryBlock',
  labels: {
    singular: 'Testimonials Minery',
    plural: 'Testimonials Minery',
  },
  fields: [
    {
      name: 'testimonials',
      type: 'array',
      label: 'Testimonios',
      minRows: 1,
      maxRows: 20,
      admin: {
        description:
          'Slider de 1 en 1 con flechas prev/next. ' +
          'Cada testimonio: cita, foto del autor, nombre y cargo.',
      },
      fields: [
        {
          name: 'quote',
          type: 'richText',
          label: 'Cita / Testimonio',
          required: true,
          editor: quoteEditor(),
          admin: {
            description: 'Texto del testimonio. Se mostrará bajo el icono de comillas.',
          },
        },
        {
          name: 'founderImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Foto del autor',
          admin: {
            description: 'Imagen cuadrada (ej. 300×300px). Se muestra circular.',
          },
        },
        {
          name: 'founderName',
          type: 'text',
          label: 'Nombre del autor',
          required: true,
          admin: { description: 'Ej: "Óliver"' },
        },
        {
          name: 'founderRole',
          type: 'text',
          label: 'Cargo / Empresa',
          admin: { description: 'Ej: "CEO de Flexicar"' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Fondo de la sección',
      fields: [
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagen de fondo',
          admin: {
            description:
              'Imagen grande (mín. 1920px). El fondo queda fijo mientras se hace scroll — efecto parallax CSS.',
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
          label: 'Overlay de color sobre el fondo (opcional)',
          admin: {
            description: 'Ej: rgba(0,0,0,0.5). Dejar vacío para sin overlay.',
          },
        },
        {
          name: 'disableParallaxOnTouch',
          type: 'checkbox',
          label: 'Desactivar parallax en dispositivos táctiles',
          defaultValue: true,
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Comportamiento del slider',
      fields: [
        {
          name: 'enableAutoplay',
          type: 'checkbox',
          label: 'Activar autoplay',
          defaultValue: false,
          admin: {
            description: 'Por defecto el slider es manual (solo flechas), igual que Minery.',
          },
        },
        {
          name: 'autoplayDelay',
          type: 'number',
          label: 'Velocidad autoplay (ms)',
          defaultValue: 4000,
          min: 1000,
          max: 10000,
          admin: {
            step: 500,
            condition: (_, siblingData) => siblingData?.enableAutoplay === true,
          },
        },
        {
          name: 'transitionSpeed',
          type: 'number',
          label: 'Velocidad de transición (ms)',
          defaultValue: 400,
          min: 100,
          max: 1500,
          admin: { step: 100 },
        },
        {
          name: 'loop',
          type: 'checkbox',
          label: 'Loop infinito',
          defaultValue: true,
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Layout y espaciado',
      fields: [
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
        {
          name: 'founderImageSize',
          type: 'select',
          label: 'Tamaño de la foto del autor',
          defaultValue: '70',
          options: [
            { label: '50px', value: '50' },
            { label: '70px (por defecto Minery)', value: '70' },
            { label: '90px', value: '90' },
            { label: '110px', value: '110' },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Tipografía',
      fields: [
        {
          name: 'quoteFont',
          type: 'select',
          label: 'Fuente del texto del testimonio',
          defaultValue: 'Montserrat, sans-serif',
          options: FONT_OPTIONS,
        },
        {
          name: 'founderFont',
          type: 'select',
          label: 'Fuente del nombre y cargo',
          defaultValue: 'Montserrat, sans-serif',
          options: FONT_OPTIONS,
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Colores',
      fields: [
        {
          name: 'quoteIconColor',
          type: 'text',
          label: 'Color del icono de comillas',
          defaultValue: '#ffffff',
          admin: { description: 'Color del SVG de comillas decorativas.' },
        },
        {
          name: 'quoteTextColor',
          type: 'text',
          label: 'Color del texto del testimonio',
          defaultValue: '#ffffff',
        },
        {
          name: 'founderNameColor',
          type: 'text',
          label: 'Color del nombre del autor',
          defaultValue: '#ffffff',
        },
        {
          name: 'founderRoleColor',
          type: 'text',
          label: 'Color del cargo',
          defaultValue: '#ffffff',
        },
        {
          name: 'arrowColor',
          type: 'text',
          label: 'Color de las flechas',
          defaultValue: '#ffffff',
          admin: {
            description: 'Color de las flechas prev/next en reposo.',
          },
        },
        {
          name: 'arrowHoverColor',
          type: 'text',
          label: 'Color de las flechas en hover',
          defaultValue: '#FFC950',
        },
        {
          name: 'arrowBorderColor',
          type: 'text',
          label: 'Color del borde de las flechas',
          defaultValue: 'rgba(255,255,255,0.4)',
        },
      ],
    },
  ],
}
