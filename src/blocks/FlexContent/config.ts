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

const eyebrowEditor = () =>
  lexicalEditor({
    features: ({ rootFeatures }) => [
      ...rootFeatures,
      ParagraphFeature(),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  })

const headingEditor = () =>
  lexicalEditor({
    features: ({ rootFeatures }) => [
      ...rootFeatures,
      ParagraphFeature(),
      HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
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
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      UnorderedListFeature(),
      LinkFeature({ enabledCollections: ['pages', 'posts'] }),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  })

/**
 * FlexContent
 * ────────────
 * Bloque de contenido flexible y configurable. Con un único bloque se pueden
 * conseguir:
 *
 *   • Intro de texto (solo eyebrow + heading + body, sin imagen)
 *   • Sección texto + imagen lateral (izquierda o derecha, ancho configurable)
 *   • Sección imagen arriba o abajo del texto
 *   • Sección con fondo imagen o color sólido
 */
export const FlexContentBlock: Block = {
  slug: 'flexContent',
  interfaceName: 'FlexContentBlock',
  labels: {
    singular: 'Flex Content',
    plural: 'Flex Contents',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'richText',
      label: 'Eyebrow (etiqueta sobre el título)',
      editor: eyebrowEditor(),
      admin: {
        description: 'Ej: "SEGURIDAD DIGITAL". Dejar vacío para ocultar.',
      },
    },
    {
      name: 'heading',
      type: 'richText',
      label: 'Título (h2)',
      editor: headingEditor(),
      admin: {
        description: 'Título principal de la sección.',
      },
    },
    {
      name: 'subheading',
      type: 'richText',
      label: 'Subtítulo (h3)',
      editor: headingEditor(),
      admin: {
        description: 'Ej: "Ponemos a prueba tus equipos...". Dejar vacío para ocultar.',
      },
    },
    {
      name: 'body',
      type: 'richText',
      label: 'Cuerpo de texto',
      editor: bodyEditor(),
      admin: {
        description: 'Párrafos de contenido. Soporta negritas, links, listas, etc.',
      },
    },
    {
      type: 'collapsible',
      label: 'Botón CTA (opcional)',
      fields: [
        {
          name: 'ctaLabel',
          type: 'text',
          label: 'Texto del botón',
          admin: { description: 'Dejar vacío para no mostrar el botón.' },
        },
        {
          name: 'ctaUrl',
          type: 'text',
          label: 'URL de destino',
        },
        {
          name: 'ctaOpenInNewTab',
          type: 'checkbox',
          label: 'Abrir en nueva pestaña',
          defaultValue: false,
        },
        {
          name: 'ctaStyle',
          type: 'select',
          label: 'Estilo del botón',
          defaultValue: 'btnNegro',
          options: [
            { label: 'BtnNegro (sweep fill, como Minery)', value: 'btnNegro' },
            { label: 'Enlace con subrayado animado', value: 'animatedLine' },
          ],
        },
        {
          name: 'buttonFillColor',
          type: 'text',
          label: 'Color del sweep fill (hover)',
          defaultValue: '#1e1e1c',
          admin: { description: 'Color con el que se rellena el botón al hacer hover.' },
        },
        {
          name: 'buttonTextColor',
          type: 'text',
          label: 'Color del texto del botón',
          defaultValue: '#ffffff',
        },
        {
          name: 'buttonBorderColor',
          type: 'text',
          label: 'Color del borde del botón',
          defaultValue: '#1e1e1c',
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Imagen (opcional)',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagen',
          admin: {
            description: 'Si no se añade imagen, el bloque muestra solo el texto centrado.',
          },
        },
        {
          name: 'imageAlt',
          type: 'text',
          label: 'Alt de la imagen',
        },
        {
          name: 'imagePosition',
          type: 'select',
          label: 'Posición de la imagen respecto al texto',
          defaultValue: 'right',
          options: [
            { label: 'Derecha del texto (por defecto)', value: 'right' },
            { label: 'Izquierda del texto', value: 'left' },
            { label: 'Encima del texto', value: 'top' },
            { label: 'Debajo del texto', value: 'bottom' },
          ],
          admin: {
            condition: (_, siblingData) => !!siblingData?.image,
          },
        },
        {
          name: 'imageWidthPercent',
          type: 'select',
          label: 'Ancho de la imagen (% del bloque)',
          defaultValue: '50',
          options: [
            { label: '25%', value: '25' },
            { label: '33%', value: '33' },
            { label: '40%', value: '40' },
            { label: '50% (por defecto)', value: '50' },
            { label: '60%', value: '60' },
            { label: '66%', value: '66' },
            { label: '75%', value: '75' },
          ],
          admin: {
            description: 'El texto ocupará el porcentaje restante.',
            condition: (_, siblingData) =>
              !!siblingData?.image &&
              ['left', 'right'].includes(siblingData?.imagePosition ?? 'right'),
          },
        },
        {
          name: 'imageVerticalAlign',
          type: 'select',
          label: 'Alineación vertical de la imagen',
          defaultValue: 'center',
          options: [
            { label: 'Arriba', value: 'start' },
            { label: 'Centro (por defecto)', value: 'center' },
            { label: 'Abajo', value: 'end' },
          ],
          admin: {
            condition: (_, siblingData) =>
              !!siblingData?.image &&
              ['left', 'right'].includes(siblingData?.imagePosition ?? 'right'),
          },
        },
        {
          name: 'imageObjectFit',
          type: 'select',
          label: 'Ajuste de la imagen',
          defaultValue: 'cover',
          options: [
            { label: 'Cover (recorta, rellena todo)', value: 'cover' },
            { label: 'Contain (muestra toda la imagen)', value: 'contain' },
          ],
          admin: {
            condition: (_, siblingData) => !!siblingData?.image,
          },
        },
        {
          name: 'imageRounded',
          type: 'checkbox',
          label: 'Bordes redondeados',
          defaultValue: false,
          admin: {
            condition: (_, siblingData) => !!siblingData?.image,
          },
        },
        {
          name: 'secondImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Segunda imagen (opcional, se apila sobre la primera)',
          admin: {
            description:
              'Como en la sección de Auditorías de Minery, donde aparecen dos imágenes apiladas.',
            condition: (_, siblingData) =>
              !!siblingData?.image &&
              ['left', 'right'].includes(siblingData?.imagePosition ?? 'right'),
          },
        },
        {
          name: 'secondImageAlt',
          type: 'text',
          label: 'Alt de la segunda imagen',
          admin: {
            condition: (_, siblingData) => !!siblingData?.secondImage,
          },
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
          defaultValue: 'color',
          options: [
            { label: 'Color sólido', value: 'color' },
            { label: 'Imagen', value: 'image' },
          ],
        },
        {
          name: 'backgroundColor',
          type: 'text',
          label: 'Color de fondo',
          defaultValue: '#ffffff',
          admin: {
            condition: (_, siblingData) => siblingData?.backgroundType !== 'image',
          },
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagen de fondo',
          admin: {
            condition: (_, siblingData) => siblingData?.backgroundType === 'image',
          },
        },
        {
          name: 'backgroundPosition',
          type: 'select',
          label: 'Posición del fondo',
          defaultValue: 'center center',
          options: [
            { label: 'Centro', value: 'center center' },
            { label: 'Arriba', value: 'center top' },
            { label: 'Abajo', value: 'center bottom' },
            { label: 'Izquierda', value: 'left center' },
            { label: 'Derecha', value: 'right center' },
          ],
          admin: {
            condition: (_, siblingData) => siblingData?.backgroundType === 'image',
          },
        },
        {
          name: 'overlayColor',
          type: 'text',
          label: 'Overlay sobre el fondo (opcional)',
          admin: {
            description: 'Ej: rgba(0,0,0,0.4). Dejar vacío para sin overlay.',
            condition: (_, siblingData) => siblingData?.backgroundType === 'image',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Layout y espaciado',
      fields: [
        {
          name: 'paddingTop',
          type: 'select',
          label: 'Padding superior',
          defaultValue: '80',
          options: [
            { label: '0px', value: '0' },
            { label: '40px', value: '40' },
            { label: '60px', value: '60' },
            { label: '80px (por defecto)', value: '80' },
            { label: '100px', value: '100' },
            { label: '120px', value: '120' },
          ],
        },
        {
          name: 'paddingBottom',
          type: 'select',
          label: 'Padding inferior',
          defaultValue: '80',
          options: [
            { label: '0px', value: '0' },
            { label: '40px', value: '40' },
            { label: '60px', value: '60' },
            { label: '80px (por defecto)', value: '80' },
            { label: '100px', value: '100' },
            { label: '120px', value: '120' },
          ],
        },
        {
          name: 'textAlign',
          type: 'select',
          label: 'Alineación del texto',
          defaultValue: 'left',
          options: [
            { label: 'Izquierda', value: 'left' },
            { label: 'Centro', value: 'center' },
            { label: 'Derecha', value: 'right' },
          ],
          admin: {
            description:
              'Cuando no hay imagen, el texto se centra automáticamente si se elige "Centro".',
          },
        },
        {
          name: 'verticalAlign',
          type: 'select',
          label: 'Alineación vertical (texto respecto a imagen)',
          defaultValue: 'center',
          options: [
            { label: 'Arriba', value: 'start' },
            { label: 'Centro', value: 'center' },
            { label: 'Abajo', value: 'end' },
          ],
          admin: {
            description: 'Solo aplica cuando la imagen está a izquierda o derecha.',
          },
        },
        {
          name: 'columnGap',
          type: 'select',
          label: 'Separación entre imagen y texto',
          defaultValue: '48',
          options: [
            { label: '16px', value: '16' },
            { label: '32px', value: '32' },
            { label: '48px (por defecto)', value: '48' },
            { label: '64px', value: '64' },
            { label: '80px', value: '80' },
          ],
          admin: {
            condition: (_, siblingData) =>
              !!siblingData?.image &&
              ['left', 'right'].includes(siblingData?.imagePosition ?? 'right'),
          },
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
          name: 'bodyFont',
          type: 'select',
          label: 'Fuente del cuerpo',
          defaultValue: 'Montserrat, sans-serif',
          options: FONT_OPTIONS,
        },
        {
          name: 'headingSize',
          type: 'select',
          label: 'Tamaño del título',
          defaultValue: '36',
          options: [
            { label: '24px', value: '24' },
            { label: '28px', value: '28' },
            { label: '32px', value: '32' },
            { label: '36px (por defecto)', value: '36' },
            { label: '40px', value: '40' },
            { label: '48px', value: '48' },
          ],
        },
        {
          name: 'subheadingSize',
          type: 'select',
          label: 'Tamaño del subtítulo',
          defaultValue: '22',
          options: [
            { label: '16px', value: '16' },
            { label: '18px', value: '18' },
            { label: '20px', value: '20' },
            { label: '22px (por defecto)', value: '22' },
            { label: '24px', value: '24' },
            { label: '28px', value: '28' },
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
          defaultValue: '#FFC950',
        },
        {
          name: 'headingColor',
          type: 'text',
          label: 'Color del título',
          defaultValue: '#1e1e1c',
        },
        {
          name: 'subheadingColor',
          type: 'text',
          label: 'Color del subtítulo',
          defaultValue: '#1e1e1c',
        },
        {
          name: 'bodyColor',
          type: 'text',
          label: 'Color del cuerpo de texto',
          defaultValue: '#1e1e1c',
        },
        {
          name: 'eyebrowLineColor',
          type: 'text',
          label: 'Color de la línea decorativa del eyebrow',
          defaultValue: '#FFC950',
          admin: {
            description: 'Línea horizontal de 54px que precede al texto del eyebrow.',
          },
        },
      ],
    },
  ],
}
