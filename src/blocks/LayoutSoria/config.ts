import type { Block } from 'payload'

import {
  AlignFeature,
  BlockquoteFeature,
  ChecklistFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  InlineToolbarFeature,
  lexicalEditor,
  OrderedListFeature,
  ParagraphFeature,
  SubscriptFeature,
  TextStateFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

const layoutSoriaRichTextState = {
  weight: {
    light: { label: 'Light', css: { 'font-weight': '300' } },
    regular: { label: 'Regular', css: { 'font-weight': '400' } },
    medium: { label: 'Medium', css: { 'font-weight': '500' } },
    semibold: { label: 'Semibold', css: { 'font-weight': '600' } },
    heavy: { label: 'Heavy', css: { 'font-weight': '800' } },
  },
  size: {
    caption: { label: 'Texto pequeño', css: {} },
  },
} as const

const richTextEditor = () =>
  lexicalEditor({
    features: ({ rootFeatures }) => [
      ...rootFeatures,
      ParagraphFeature(),
      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }),
      AlignFeature(),
      IndentFeature(),
      UnorderedListFeature(),
      OrderedListFeature(),
      ChecklistFeature(),
      BlockquoteFeature(),
      HorizontalRuleFeature(),
      SubscriptFeature(),
      TextStateFeature({ state: layoutSoriaRichTextState }),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  })

export const LayoutSoriaBlock: Block = {
  slug: 'layoutSoria',
  interfaceName: 'LayoutSoriaBlock',
  labels: {
    singular: 'Layout Soria',
    plural: 'Layout Soria Blocks',
  },
  fields: [
    {
      name: 'anchorId',
      type: 'text',
      label: 'ID ancla',
      admin: {
        description:
          'ID para enlaces ancla (ej: mi-seccion). Usar el mismo valor en el navbar en "Id ancla (misma página)".',
      },
    },
    {
      name: 'richText',
      type: 'richText',
      editor: richTextEditor(),
      label: 'Contenido principal (RichText)',
      required: false,
    },
    {
      name: 'image',
      type: 'group',
      label: 'Imagen principal',
      fields: [
        {
          name: 'useMedia',
          type: 'checkbox',
          label: 'Usar imagen subida',
          defaultValue: true,
        },
        {
          name: 'mediaImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_, siblingData) => siblingData?.useMedia === true,
            description: 'Seleccione una imagen de la libreria',
          },
        },
        {
          name: 'useViewportSize',
          type: 'checkbox',
          label: 'Tamaño personalizado (viewport)',
          defaultValue: false,
          admin: {
            condition: (_, siblingData) => siblingData?.useMedia === true,
            description:
              'Fija ancho y alto en vw/vh. En escritorio (pantallas lg o más) use los valores de “escritorio”; en móvil puede usar valores distintos abajo o dejarlos vacíos para reutilizar los de escritorio.',
          },
        },
        {
          name: 'mediaWidthVw',
          type: 'number',
          label: 'Ancho escritorio (% → vw)',
          min: 1,
          max: 200,
          admin: {
            condition: (_, siblingData) =>
              siblingData?.useMedia === true && siblingData?.useViewportSize === true,
            description: 'Pantallas ≥1024px (lg). Ej.: 80 → 80vw.',
            step: 1,
          },
        },
        {
          name: 'mediaHeightVh',
          type: 'number',
          label: 'Alto escritorio (% → vh)',
          min: 1,
          max: 200,
          admin: {
            condition: (_, siblingData) =>
              siblingData?.useMedia === true && siblingData?.useViewportSize === true,
            description: 'Pantallas ≥1024px (lg). Ej.: 50 → 50vh.',
            step: 1,
          },
        },
        {
          name: 'mediaWidthVwMobile',
          type: 'number',
          label: 'Ancho móvil (% → vw)',
          min: 1,
          max: 200,
          admin: {
            condition: (_, siblingData) =>
              siblingData?.useMedia === true && siblingData?.useViewportSize === true,
            description:
              'Pantallas menores a 1024px (móvil/tablet). Opcional: si rellena ancho y alto móvil, sustituyen a escritorio en pantallas pequeñas. Si vacío, se usan los de escritorio.',
            step: 1,
          },
        },
        {
          name: 'mediaHeightVhMobile',
          type: 'number',
          label: 'Alto móvil (% → vh)',
          min: 1,
          max: 200,
          admin: {
            condition: (_, siblingData) =>
              siblingData?.useMedia === true && siblingData?.useViewportSize === true,
            description: 'Pantallas menores a 1024px. Debe ir junto a “Ancho móvil” para aplicarse.',
            step: 1,
          },
        },
        {
          name: 'src',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.useMedia === false,
            description: 'URL de la imagen cuando no se usa media subida',
          },
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Texto alternativo',
          defaultValue: 'Layout Soria image',
        },
      ],
    },
    {
      name: 'subHeadings',
      type: 'array',
      dbName: 'ls_sub',
      label: 'Subheadings',
      maxRows: 2,
      fields: [
        {
          name: 'icon',
          type: 'group',
          label: 'Icono',
          fields: [
            {
              name: 'useMedia',
              type: 'checkbox',
              label: 'Usar imagen subida',
              defaultValue: false,
            },
            {
              name: 'mediaImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (_, siblingData) => siblingData?.useMedia === true,
                description: 'Seleccione una imagen para el icono',
              },
            },
            {
              name: 'iconSVG',
              type: 'textarea',
              label: 'Icono SVG',
              admin: {
                condition: (_, siblingData) => siblingData?.useMedia !== true,
                description: 'Codigo SVG del icono del subheading',
              },
            },
            {
              name: 'alt',
              type: 'text',
              label: 'Alt del icono',
              defaultValue: 'Subheading icon',
            },
          ],
        },
        {
          name: 'content',
          type: 'richText',
          editor: richTextEditor(),
          label: 'Contenido del subheading (RichText)',
          required: false,
        },
      ],
    },
    {
      name: 'buttons',
      type: 'array',
      dbName: 'ls_btns',
      label: 'Botones',
      maxRows: 2,
      fields: [
        link({ appearances: false }),
        {
          name: 'appearance',
          type: 'select',
          dbName: 'app',
          label: 'Estilo del boton',
          defaultValue: 'secondary',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
            { label: 'Link', value: 'link' },
          ],
        },
        {
          name: 'size',
          type: 'select',
          dbName: 'sz',
          label: 'Tamano del boton',
          defaultValue: 'sm',
          options: [
            { label: 'Small', value: 'sm' },
            { label: 'Large', value: 'lg' },
            { label: 'Clear', value: 'clear' },
          ],
        },
        {
          name: 'iconSVG',
          type: 'textarea',
          label: 'Icono SVG del boton (opcional)',
        },
      ],
    },
    {
      name: 'invertLayout',
      type: 'checkbox',
      label: 'Invertir disposicion',
      defaultValue: false,
    },
    {
      name: 'backgroundColor',
      type: 'text',
      label: 'Color de fondo del bloque',
    },
    {
      name: 'applyCustomWidth',
      type: 'checkbox',
      label: 'Aplicar ancho personalizado',
      defaultValue: false,
      admin: {
        description:
          'Si está activo, el contenido (texto, subheadings, imagen y botones) usa el ancho en % del viewport; el color de fondo sigue a ancho completo. Si no lo marcas, el diseño no cambia.',
      },
    },
    {
      name: 'customWidthPercent',
      type: 'number',
      label: 'Ancho respecto a la pantalla (%)',
      min: 0,
      max: 100,
      defaultValue: 100,
      admin: {
        condition: (_, siblingData) => siblingData?.applyCustomWidth === true,
        description:
          '0–100. Ej.: 50 = el contenido ocupa el 50% del ancho de la ventana, centrado; sin paddings laterales extra sobre ese ancho.',
      },
    },
    {
      name: 'customWidthPercentMobile',
      type: 'number',
      label: 'Ancho personalizado (dispositivos móvil)',
      min: 0,
      max: 100,
      admin: {
        condition: (_, siblingData) => siblingData?.applyCustomWidth === true,
        description:
          'Opcional. Si lo dejas vacío, en móvil se usa el mismo “Ancho respecto a la pantalla (%)” que arriba. Si indicas un valor (0–100), solo en pantallas menores a 768px de ancho el bloque usará ese ancho; desde tablet y desktop sigue el campo principal.',
      },
    },
    {
      name: 'textColor',
      type: 'text',
      label: 'Color del texto principal',
    },
    {
      name: 'boldTextColor',
      type: 'text',
      label: 'Color del texto en negrita',
    },
    {
      name: 'buttonBackgroundColor',
      type: 'text',
      label: 'Color de fondo de botones',
    },
    {
      name: 'buttonTextColor',
      type: 'text',
      label: 'Color del texto de botones',
    },
    {
      name: 'fontFamily',
      type: 'select',
      label: 'Tipografia',
      options: [
        { label: 'Por defecto', value: 'default' },
        { label: 'Arial', value: 'Arial, sans-serif' },
        { label: 'Times New Roman', value: '"Times New Roman", serif' },
        { label: 'Georgia', value: 'Georgia, serif' },
        { label: 'Verdana', value: 'Verdana, sans-serif' },
        { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
        { label: 'Courier New', value: '"Courier New", monospace' },
        { label: 'Roboto', value: '"Roboto", sans-serif' },
        { label: 'Open Sans', value: '"Open Sans", sans-serif' },
        { label: 'Lato', value: '"Lato", sans-serif' },
        { label: 'Montserrat', value: '"Montserrat", sans-serif' },
        { label: 'Playfair Display', value: '"Playfair Display", serif' },
        { label: 'Inter', value: '"Inter", sans-serif' },
        { label: 'Poppins', value: '"Poppins", sans-serif' },
        { label: 'Raleway', value: '"Raleway", sans-serif' },
      ],
      defaultValue: 'default',
    },
  ],
}

