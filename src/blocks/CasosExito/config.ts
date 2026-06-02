import type { Block } from 'payload'

import {
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
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

const bodyEditor = () =>
  lexicalEditor({
    features: ({ rootFeatures }) => [
      ...rootFeatures,
      ParagraphFeature(),
      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      LinkFeature({ enabledCollections: ['pages', 'posts'] }),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  })

export const CasosExitoBlock: Block = {
  slug: 'casosExito',
  interfaceName: 'CasosExitoBlock',
  labels: {
    singular: 'Casos de éxito',
    plural: 'Casos de éxito',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'richText',
      label: 'Eyebrow (etiqueta encima del título)',
      editor: headlineEditor(),
      admin: { description: 'Ej: "CASOS DE ÉXITO"' },
    },
    {
      name: 'heading',
      type: 'richText',
      label: 'Título de la sección',
      editor: headlineEditor(),
      admin: { description: 'Ej: "Nuestros hitos"' },
    },
    {
      name: 'slides',
      type: 'array',
      label: 'Slides (casos de éxito)',
      minRows: 1,
      maxRows: 10,
      admin: {
        description:
          'Cada slide muestra: imagen a la izquierda + nombre de empresa y texto a la derecha. ' +
          'En mobile se apilan (imagen arriba, texto abajo).',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagen del caso (landscape recomendada)',
          required: true,
          admin: {
            description: 'Formato horizontal/panorámico. Ej: 800×500 px.',
          },
        },
        {
          name: 'imageAlt',
          type: 'text',
          label: 'Alt de la imagen',
        },
        {
          name: 'company',
          type: 'richText',
          label: 'Nombre de la empresa / cliente',
          required: true,
          editor: headlineEditor(),
          admin: { description: 'Ej: "ECIJA", "EJÉRCITO DEL AIRE"' },
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Descripción del caso',
          editor: bodyEditor(),
          admin: {
            description: 'Párrafo con el hito o logro conseguido.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Comportamiento del slider',
      fields: [
        {
          name: 'effect',
          type: 'select',
          label: 'Tipo de transición',
          defaultValue: 'fade',
          options: [
            { label: 'Fade (fundido — igual que el original)', value: 'fade' },
            { label: 'Slide (deslizamiento horizontal)', value: 'slide' },
          ],
          admin: {
            description: 'Fade es el más cercano al comportamiento del slider original.',
          },
        },
        {
          name: 'autoplay',
          type: 'checkbox',
          label: 'Autoplay',
          defaultValue: true,
        },
        {
          name: 'autoplayDelay',
          type: 'number',
          label: 'Intervalo de autoplay (ms)',
          defaultValue: 4500,
          min: 1000,
          max: 15000,
          admin: {
            step: 500,
            description: '4500 ms (4.5 s) es el valor por defecto de Minery.',
            condition: (_, siblingData) => siblingData?.autoplay === true,
          },
        },
        {
          name: 'loop',
          type: 'checkbox',
          label: 'Loop infinito',
          defaultValue: true,
        },
        {
          name: 'speed',
          type: 'number',
          label: 'Velocidad de la transición (ms)',
          defaultValue: 800,
          min: 200,
          max: 3000,
          admin: {
            step: 100,
            description: 'Duración de la animación entre slides. 800ms ≈ Slick por defecto.',
          },
        },
        {
          name: 'pauseOnHover',
          type: 'checkbox',
          label: 'Pausar autoplay al pasar el ratón',
          defaultValue: true,
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Layout',
      fields: [
        {
          name: 'imagePosition',
          type: 'select',
          label: 'Lado de la imagen',
          defaultValue: 'left',
          options: [
            { label: 'Izquierda (por defecto Minery)', value: 'left' },
            { label: 'Derecha', value: 'right' },
          ],
        },
        {
          name: 'imageSplit',
          type: 'select',
          label: 'Proporción imagen / texto',
          defaultValue: '50/50',
          options: [
            { label: '50% / 50%', value: '50/50' },
            { label: '60% imagen / 40% texto', value: '60/40' },
            { label: '40% imagen / 60% texto', value: '40/60' },
          ],
        },
        {
          name: 'slideMinHeight',
          type: 'number',
          label: 'Altura mínima del slide (px)',
          defaultValue: 420,
          min: 200,
          max: 800,
          admin: { step: 20 },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Fondo de la sección',
      fields: [
        {
          name: 'sectionBackground',
          type: 'text',
          label: 'Color de fondo de la sección',
          defaultValue: '#ffffff',
          admin: { description: 'Color hex o CSS.' },
        },
        {
          name: 'slideBackground',
          type: 'text',
          label: 'Color de fondo del área de texto de cada slide',
          defaultValue: '#f3f3f3',
          admin: {
            description:
              'Fondo del panel de texto derecho (o izquierdo) de cada slide. ' +
              'Ej: #f3f3f3, #1e1e1c, #FFC950.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Tipografía',
      fields: [
        {
          name: 'headerFont',
          type: 'select',
          label: 'Fuente del encabezado de sección',
          defaultValue: 'Montserrat, sans-serif',
          options: FONT_OPTIONS,
        },
        {
          name: 'slideFont',
          type: 'select',
          label: 'Fuente de los slides',
          defaultValue: 'Montserrat, sans-serif',
          options: FONT_OPTIONS,
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Colores de texto',
      fields: [
        {
          name: 'eyebrowColor',
          type: 'text',
          label: 'Color del eyebrow',
          defaultValue: '#FFC950',
        },
        {
          name: 'headingColor',
          type: 'text',
          label: 'Color del título de sección',
          defaultValue: '#1e1e1c',
        },
        {
          name: 'companyColor',
          type: 'text',
          label: 'Color del nombre de empresa',
          defaultValue: '#1e1e1c',
          admin: { description: 'Color del nombre en cada slide.' },
        },
        {
          name: 'descriptionColor',
          type: 'text',
          label: 'Color de la descripción',
          defaultValue: '#1e1e1c',
        },
        {
          name: 'dotsColor',
          type: 'text',
          label: 'Color de los dots de navegación',
          defaultValue: '#FFC950',
          admin: {
            description:
              'Color activo del dot (punto de navegación). ' +
              'Los dots inactivos usarán el mismo color con opacidad reducida.',
          },
        },
      ],
    },
  ],
}
