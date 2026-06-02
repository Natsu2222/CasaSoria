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

export const CasosExitoGridsBlock: Block = {
  slug: 'casosExitoGrids',
  interfaceName: 'CasosExitoGridsBlock',
  labels: {
    singular: 'Grid de casos de éxito',
    plural: 'Grids de casos de éxito',
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
      name: 'cases',
      type: 'array',
      label: 'Casos de éxito',
      minRows: 1,
      maxRows: 12,
      admin: {
        description:
          'Grid 2 columnas en desktop. Cada caso: imagen arriba + nombre empresa + descripción. ' +
          'Los items impares (1ª, 3ª…) entran desde la izquierda al scroll; ' +
          'los pares (2ª, 4ª…) entran desde la derecha.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagen',
          required: true,
          admin: {
            description: 'Formato landscape recomendado. Ocupa el ancho completo de la columna.',
          },
        },
        {
          name: 'imageAlt',
          type: 'text',
          label: 'Alt de la imagen',
        },
        {
          name: 'company',
          type: 'text',
          label: 'Nombre de la empresa',
          required: true,
          admin: {
            description:
              'Se muestra en mayúsculas y negrita. Ej: "ECIJA", "EJÉRCITO DEL AIRE".',
          },
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Descripción del caso',
          editor: bodyEditor(),
          admin: {
            description: 'Párrafo con el logro o hito conseguido con este cliente.',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL del caso (opcional)',
          admin: {
            description: 'Si se rellena, el nombre de la empresa y/o la imagen serán un enlace.',
          },
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
      label: 'Animación de entrada',
      fields: [
        {
          name: 'enableAnimation',
          type: 'checkbox',
          label: 'Activar fade-in alternado al scroll',
          defaultValue: true,
          admin: {
            description:
              'Items de la columna izquierda entran desde la izquierda; ' +
              'items de la columna derecha entran desde la derecha.',
          },
        },
        {
          name: 'animationDistance',
          type: 'number',
          label: 'Distancia de desplazamiento (px)',
          defaultValue: 60,
          min: 10,
          max: 200,
          admin: {
            step: 10,
            description: 'Cuántos píxeles se desplaza el item antes de entrar. 60px ≈ Minery.',
            condition: (_, siblingData) => siblingData?.enableAnimation === true,
          },
        },
        {
          name: 'animationDuration',
          type: 'number',
          label: 'Duración de la animación (ms)',
          defaultValue: 800,
          min: 200,
          max: 2000,
          admin: {
            step: 100,
            condition: (_, siblingData) => siblingData?.enableAnimation === true,
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
          name: 'cardFont',
          type: 'select',
          label: 'Fuente de las cards',
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
          name: 'sectionBackground',
          type: 'text',
          label: 'Color de fondo de la sección',
          defaultValue: '#ffffff',
        },
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
        },
        {
          name: 'descriptionColor',
          type: 'text',
          label: 'Color de la descripción',
          defaultValue: '#1e1e1c',
        },
      ],
    },
  ],
}
