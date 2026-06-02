import type { Block } from 'payload'

// ─── Font options shared between section header and cards ─────────────────────
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

export const ServiciosGridBlock: Block = {
  slug: 'servicesGrid',
  interfaceName: 'ServicesGridBlock',
  labels: {
    singular: 'Grid de Servicios',
    plural: 'Grids de Servicios',
  },
  fields: [
    // ─── SECTION HEADER ────────────────────────────────────────────────────────
    {
      name: 'eyebrow',
      type: 'richText',
      label: 'Eyebrow (etiqueta pequeña)',
      admin: {
        description: 'Texto pequeño encima del título. Ej: "LO QUE BUSCAS"',
      },
    },
    {
      name: 'heading',
      type: 'richText',
      label: 'Título principal de la sección',
      admin: {
        description: 'Ej: "Nuestros servicios destacados"',
      },
    },
    {
      name: 'headerFont',
      type: 'select',
      label: 'Tipografía del encabezado',
      defaultValue: 'Montserrat, sans-serif',
      options: FONT_OPTIONS,
    },
    {
      name: 'eyebrowColor',
      type: 'text',
      label: 'Color de la línea del eyebrow',
      defaultValue: '#FFC950',
      admin: { description: 'Línea decorativa a la izquierda del eyebrow. El texto usa el color del título.' },
    },
    {
      name: 'headingColor',
      type: 'text',
      label: 'Color del título de sección',
      defaultValue: '#1e1e1c',
      admin: { description: 'Color hex o CSS.' },
    },
    {
      name: 'backgroundColor',
      type: 'text',
      label: 'Color de fondo de la sección',
      defaultValue: '#ffffff',
      admin: {
        description: 'Color de fondo del bloque completo. Acepta hex, rgb, oklch, etc.',
      },
    },

    // ─── SERVICE CARDS ──────────────────────────────────────────────────────────
    {
      name: 'services',
      type: 'array',
      label: 'Tarjetas de servicio',
      minRows: 1,
      maxRows: 6,
      admin: {
        description:
          'Cada tarjeta muestra: icono, título y descripción centrados. ' +
          'Al hacer hover se aplica el relleno de color y cambian los colores del texto.',
      },
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'Icono',
          required: true,
          admin: {
            description: 'Imagen cuadrada ~80–100 px. Fondo transparente recomendado.',
          },
        },
        {
          name: 'title',
          type: 'richText',
          label: 'Título del servicio',
          admin: {
            description: 'Siempre visible (también en reposo). Ej: "Ciberseguridad para Empresas"',
          },
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Descripción',
          admin: {
            description: 'Texto descriptivo bajo el título. Por defecto siempre visible.',
          },
        },
        {
          name: 'hideDescriptionUntilHover',
          type: 'checkbox',
          label: 'Ocultar descripción hasta hover',
          defaultValue: false,
          admin: {
            description:
              'Si está activo, la descripción solo aparece al pasar el cursor sobre la tarjeta (en dispositivos táctiles sigue visible).',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL de destino (hace el título un enlace)',
          admin: {
            description: 'Ej: /ciberseguridad/caas/',
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

    // ─── TIPOGRAFÍA DE TARJETAS ────────────────────────────────────────────────
    {
      name: 'cardFont',
      type: 'select',
      label: 'Tipografía de las tarjetas',
      defaultValue: 'Montserrat, sans-serif',
      options: FONT_OPTIONS,
      admin: {
        description: 'Fuente aplicada al título y descripción de cada tarjeta.',
      },
    },

    // ─── COLORES EN REPOSO ─────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Colores — estado en reposo',
      fields: [
        {
          name: 'cardBackground',
          type: 'text',
          label: 'Fondo de la tarjeta (reposo)',
          defaultValue: '#f3f3f3',
          admin: { description: 'Color de fondo cuando la tarjeta NO está en hover.' },
        },
        {
          name: 'textColorRest',
          type: 'text',
          label: 'Color del texto (reposo)',
          defaultValue: '#1e1e1c',
          admin: {
            description:
              'Color del título (siempre visible). ' +
              'También es el color del icono si no tiene color propio.',
          },
        },
        {
          name: 'accentColor',
          type: 'text',
          label: 'Color del borde decorativo superior',
          defaultValue: '#FFC950',
          admin: {
            description:
              'Borde de 3px en la parte inferior de la tarjeta. ' +
              'En hover cambia de color según "Color del borde en hover".',
          },
        },
      ],
    },

    // ─── COLORES EN HOVER ──────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Colores — estado hover (relleno de la tarjeta)',
      admin: {
        description:
          'Al hacer hover sobre una tarjeta, el fondo se rellena con un color y ' +
          'el texto cambia. Aquí controlas ambos.',
      },
      fields: [
        {
          name: 'hoverFillColor',
          type: 'text',
          label: 'Color de relleno en hover',
          defaultValue: '#FFC950',
          admin: {
            description:
              'Color con el que se rellena la tarjeta al hacer hover. ' +
              'Ej: #FFC950 (amarillo Minery), #1e1e1c (negro), #ffffff (blanco).',
          },
        },
        {
          name: 'textColorHover',
          type: 'text',
          label: 'Color del texto en hover',
          defaultValue: '#1e1e1c',
          admin: {
            description:
              'Color del título Y la descripción cuando la tarjeta está en hover.',
          },
        },
        {
          name: 'accentColorHover',
          type: 'text',
          label: 'Color del borde decorativo superior en hover',
          defaultValue: '#f3f3f3',
          admin: {
            description: 'El borde inferior pasa de 3px a 9px y cambia a este color en hover.',
          },
        },
      ],
    },
  ],
}
