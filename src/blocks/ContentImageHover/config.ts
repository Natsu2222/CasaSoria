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

const textState = {
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
      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
      AlignFeature(),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      TextStateFeature({ state: textState }),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  })

const bodyEditor = () =>
  lexicalEditor({
    features: ({ rootFeatures }) => [
      ...rootFeatures,
      ParagraphFeature(),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      UnorderedListFeature(),
      LinkFeature({ enabledCollections: ['pages', 'posts'] }),
      TextStateFeature({ state: textState }),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  })

export const ContentImageHoverBlock: Block = {
  slug: 'contentImageHover',
  interfaceName: 'ContentImageHoverBlock',
  labels: {
    singular: 'Content Image Hover',
    plural: 'Content Image Hover',
  },
  fields: [
    {
      name: 'imagePosition',
      type: 'select',
      label: 'Posición de las imágenes',
      defaultValue: 'right',
      options: [
        { label: 'Derecha (imagen) — Izquierda (texto)', value: 'right' },
        { label: 'Izquierda (imagen) — Derecha (texto)', value: 'left' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Imágenes apiladas',
      fields: [
        {
          name: 'baseImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagen base (capa inferior)',
          required: true,
          admin: {
            description:
              'Imagen de fondo del compositor (ej. marco o panel). ' +
              'La imagen superior se apila encima.',
          },
        },
        {
          name: 'baseImageAlt',
          type: 'text',
          label: 'Alt de la imagen base',
        },
        {
          name: 'topImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagen superior (crece en hover)',
          required: true,
          admin: {
            description:
              'Capa visible encima de la base. Al pasar el cursor, ' +
              'esta imagen escala según el valor configurado.',
          },
        },
        {
          name: 'topImageAlt',
          type: 'text',
          label: 'Alt de la imagen superior',
        },
        {
          name: 'hoverScale',
          type: 'select',
          label: 'Escala de crecimiento en hover',
          defaultValue: '1.1',
          options: [
            { label: '1.05 (sutil)', value: '1.05' },
            { label: '1.1 (por defecto)', value: '1.1' },
            { label: '1.15 (notable)', value: '1.15' },
            { label: '1.2 (grande)', value: '1.2' },
            { label: '1.25 (muy grande)', value: '1.25' },
            { label: '1.3 (extra)', value: '1.3' },
          ],
          admin: {
            description: 'Factor de escala aplicado a la imagen superior al pasar el cursor.',
          },
        },
        {
          name: 'hoverDuration',
          type: 'select',
          label: 'Duración de la animación',
          defaultValue: '600',
          options: [
            { label: '300ms (rápida)', value: '300' },
            { label: '600ms (por defecto)', value: '600' },
            { label: '900ms (suave)', value: '900' },
            { label: '1200ms (lenta)', value: '1200' },
          ],
        },
      ],
    },
    {
      name: 'heading',
      type: 'richText',
      label: 'Título',
      required: true,
      editor: headlineEditor(),
    },
    {
      name: 'subheading',
      type: 'richText',
      label: 'Subtítulo',
      editor: headlineEditor(),
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Descripción',
      editor: bodyEditor(),
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
          name: 'subheadingFont',
          type: 'select',
          label: 'Fuente del subtítulo',
          defaultValue: 'Montserrat, sans-serif',
          options: FONT_OPTIONS,
        },
        {
          name: 'descriptionFont',
          type: 'select',
          label: 'Fuente de la descripción',
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
          name: 'headingColor',
          type: 'text',
          label: 'Color del título',
          defaultValue: '#1e1e1c',
          admin: { description: 'Color hex o CSS.' },
        },
        {
          name: 'subheadingColor',
          type: 'text',
          label: 'Color del subtítulo',
          defaultValue: '#1e1e1c',
          admin: { description: 'Color hex o CSS.' },
        },
        {
          name: 'descriptionColor',
          type: 'text',
          label: 'Color de la descripción',
          defaultValue: '#1e1e1c',
          admin: { description: 'Color hex o CSS.' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Fondo y espaciado',
      fields: [
        {
          name: 'backgroundColor',
          type: 'text',
          label: 'Color de fondo del bloque',
          defaultValue: '#f3f3f3',
          admin: { description: 'Color hex o CSS.' },
        },
        {
          name: 'paddingY',
          type: 'select',
          label: 'Padding vertical',
          defaultValue: '120',
          options: [
            { label: '80px', value: '80' },
            { label: '100px', value: '100' },
            { label: '120px (por defecto)', value: '120' },
            { label: '160px', value: '160' },
            { label: '200px', value: '200' },
          ],
        },
      ],
    },
  ],
}
