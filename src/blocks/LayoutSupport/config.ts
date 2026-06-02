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

const layoutSupportTextState = {
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
      TextStateFeature({ state: layoutSupportTextState }),
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
      AlignFeature(),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      UnorderedListFeature(),
      LinkFeature({ enabledCollections: ['pages', 'posts'] }),
      TextStateFeature({ state: layoutSupportTextState }),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  })

export const LayoutSupportBlock: Block = {
  slug: 'layoutSupport',
  interfaceName: 'LayoutSupportBlock',
  labels: {
    singular: 'Layout Support',
    plural: 'Layout Support',
  },
  fields: [
    {
      name: 'imagePosition',
      type: 'select',
      label: 'Posición de la imagen',
      defaultValue: 'left',
      options: [
        { label: 'Izquierda (imagen) — Derecha (texto)', value: 'left' },
        { label: 'Derecha (imagen) — Izquierda (texto)', value: 'right' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen principal',
      required: true,
      admin: {
        description:
          'Imagen cuadrada o vertical recomendada. ' +
          'Recibe una animación de pulso/respiración (box-shadow) en el color de acento elegido.',
      },
    },
    {
      name: 'imageAlt',
      type: 'text',
      label: 'Texto alternativo de la imagen (alt)',
    },
    {
      name: 'eyebrow',
      type: 'richText',
      label: 'Eyebrow (etiqueta pequeña encima del título)',
      editor: headlineEditor(),
      admin: {
        description: 'Ej: "¿PREOCUPADO POR TU EMPRESA?"',
      },
    },
    {
      name: 'heading',
      type: 'richText',
      label: 'Título principal',
      required: true,
      editor: headlineEditor(),
      admin: {
        description: 'Ej: "Estado de Madurez en Ciberseguridad"',
      },
    },
    {
      name: 'body',
      type: 'richText',
      label: 'Cuerpo de texto',
      editor: bodyEditor(),
      admin: {
        description: 'Párrafo/s descriptivos. Soporta formato enriquecido.',
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
          defaultValue: '¿INTERESADO?',
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL de destino',
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
      label: 'Tipografía',
      fields: [
        {
          name: 'eyebrowFont',
          type: 'select',
          label: 'Fuente del eyebrow',
          defaultValue: 'Montserrat, sans-serif',
          options: FONT_OPTIONS,
        },
        {
          name: 'headingFont',
          type: 'select',
          label: 'Fuente del título',
          defaultValue: 'Montserrat, sans-serif',
          options: FONT_OPTIONS,
        },
        {
          name: 'bodyFont',
          type: 'select',
          label: 'Fuente del cuerpo de texto',
          defaultValue: 'Montserrat, sans-serif',
          options: FONT_OPTIONS,
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Fondo de la sección',
      fields: [
        {
          name: 'backgroundType',
          type: 'select',
          label: 'Tipo de fondo',
          defaultValue: 'image',
          options: [
            { label: 'Imagen de fondo', value: 'image' },
            { label: 'Color sólido', value: 'color' },
          ],
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagen de fondo',
          admin: {
            description:
              'Se posiciona según "Posición del fondo". ' +
              'Cubre toda la sección (background-size: cover).',
            condition: (_, siblingData) => siblingData?.backgroundType === 'image',
          },
        },
        {
          name: 'backgroundPosition',
          type: 'select',
          label: 'Posición del fondo',
          defaultValue: 'right center',
          options: [
            { label: 'Centro', value: 'center center' },
            { label: 'Derecha (por defecto Minery)', value: 'right center' },
            { label: 'Izquierda', value: 'left center' },
            { label: 'Arriba', value: 'center top' },
            { label: 'Abajo', value: 'center bottom' },
          ],
          admin: {
            condition: (_, siblingData) => siblingData?.backgroundType === 'image',
          },
        },
        {
          name: 'backgroundColor',
          type: 'text',
          label: 'Color de fondo',
          defaultValue: '#ffffff',
          admin: {
            description: 'Color hex o CSS. Se usa cuando el tipo de fondo es "Color sólido".',
            condition: (_, siblingData) => siblingData?.backgroundType === 'color',
          },
        },
        {
          name: 'overlayColor',
          type: 'text',
          label: 'Color del overlay sobre la imagen (opcional)',
          admin: {
            description:
              'Capa semitransparente sobre la imagen de fondo. ' +
              'Ej: rgba(0,0,0,0.4) para oscurecer, rgba(255,255,255,0.1) para aclarar. ' +
              'Dejar vacío para sin overlay.',
            condition: (_, siblingData) => siblingData?.backgroundType === 'image',
          },
        },
        {
          name: 'paddingY',
          type: 'select',
          label: 'Padding vertical de la sección',
          defaultValue: '160',
          options: [
            { label: '80px', value: '80' },
            { label: '120px', value: '120' },
            { label: '160px (por defecto Minery)', value: '160' },
            { label: '200px', value: '200' },
          ],
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
          defaultValue: '#1e1e1c',
          admin: { description: 'Color hex o CSS.' },
        },
        {
          name: 'headingColor',
          type: 'text',
          label: 'Color del título',
          defaultValue: '#1e1e1c',
          admin: { description: 'Color hex o CSS.' },
        },
        {
          name: 'bodyColor',
          type: 'text',
          label: 'Color del cuerpo de texto',
          defaultValue: '#f3f3f3',
          admin: {
            description:
              'Color hex o CSS. Por defecto #f3f3f3 (blanco-web) para ' +
              'contrastar con fondos oscuros/imagen.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Animación',
      fields: [
        {
          name: 'imagePulseColor',
          type: 'text',
          label: 'Color del pulso de la imagen (square-animation)',
          defaultValue: '#FFC950',
          admin: {
            description:
              'Color del box-shadow pulsante alrededor de la imagen. ' +
              'Ej: #FFC950 (amarillo Minery), transparent para desactivar.',
          },
        },
        {
          name: 'enableFadeIn',
          type: 'checkbox',
          label: 'Activar animación de entrada del texto (slide lateral)',
          defaultValue: true,
          admin: {
            description:
              'El texto aparece deslizándose desde el lado opuesto a la imagen al entrar ' +
              'en pantalla, y desaparece al salir. La animación se repite cada vez que ' +
              'la sección vuelve al viewport.',
          },
        },
      ],
    },
  ],
}
