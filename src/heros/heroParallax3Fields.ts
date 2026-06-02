import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  LinkFeature,
  ParagraphFeature,
} from '@payloadcms/richtext-lexical'

const headlineEditor = () =>
  lexicalEditor({
    features: ({ rootFeatures }) => [
      ...rootFeatures,
      ParagraphFeature(),
      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3'] }),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  })

const bodyEditor = () =>
  lexicalEditor({
    features: ({ rootFeatures }) => [
      ...rootFeatures,
      ParagraphFeature(),
      LinkFeature({ enabledCollections: ['pages', 'posts'] }),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  })

export const heroParallax3GroupField: Field = {
  name: 'heroParallax3',
  type: 'group',
  label: 'Hero Parallax 3',
  admin: {
    condition: (_, { type } = {}) => type === 'heroParallax3',
    hideGutter: true,
  },
  fields: [
    {
      name: 'title',
      type: 'richText',
      editor: headlineEditor(),
      label: 'Título principal',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'richText',
      editor: bodyEditor(),
      label: 'Subtítulo / tagline',
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
          defaultValue: '¿Hablamos?',
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL de destino',
          defaultValue: '/contacto',
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          label: 'Abrir en nueva pestaña',
          defaultValue: false,
        },
        {
          name: 'baseColor',
          type: 'text',
          label: 'Color de fondo del botón',
          defaultValue: '#1e1e1c',
          admin: {
            description: 'Fondo en reposo, antes del barrido.',
          },
        },
        {
          name: 'fillColor',
          type: 'text',
          label: 'Color del barrido (hover)',
          defaultValue: '#f3f3f3',
          admin: {
            description: 'Color que barre el botón al pasar el ratón.',
          },
        },
        {
          name: 'textColor',
          type: 'text',
          label: 'Color del texto (reposo)',
          defaultValue: '#f3f3f3',
        },
        {
          name: 'hoverTextColor',
          type: 'text',
          label: 'Color del texto (hover)',
          defaultValue: '#1e1e1c',
          admin: {
            description: 'Texto cuando el barrido ha cubierto el botón.',
          },
        },
      ],
    },
    {
      name: 'leftBackgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen de fondo (columna izquierda)',
      admin: {
        description:
          'Imagen que cubre la zona de texto. Sustituye el color de fondo de Hero Parallax 2.',
      },
    },
    {
      name: 'textColor',
      type: 'text',
      label: 'Color del texto',
      defaultValue: '#171714',
      admin: {
        description: 'Color hex o CSS para el título y subtítulo.',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen de fondo estática (opcional)',
      admin: {
        description:
          'Imagen que cubre todo el hero detrás de las capas parallax. Se mueve con efecto parallax en desktop.',
      },
    },
    {
      name: 'backgroundMoveValue',
      type: 'number',
      label: 'Parallax de la imagen de fondo (desktop)',
      defaultValue: 3,
      min: 0,
      max: 30,
      admin: {
        step: 1,
        description:
          'Intensidad del movimiento al mover el ratón. Valores bajos (2–4) suelen funcionar bien para el fondo.',
      },
    },
    {
      name: 'layers',
      type: 'array',
      label: 'Capas parallax (mousemove)',
      minRows: 1,
      maxRows: 5,
      admin: {
        description:
          'Imágenes que se mueven con el ratón. El orden importa: index 0 = fondo, el último = frente. ' +
          'En Minery: cielo (valor 5) · montañas (valor 5) · persona (valor 10).',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagen',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Texto alternativo (alt)',
        },
        {
          name: 'moveValue',
          type: 'number',
          label: 'Valor de movimiento (data-value)',
          defaultValue: 5,
          min: 1,
          max: 30,
          admin: {
            step: 1,
            description:
              'Cuanto mayor el número, más se desplaza esta capa al mover el ratón. ' +
              'Capas de fondo → valores bajos (3-6). Capas de frente → valores altos (8-15).',
          },
        },
        {
          name: 'opacity',
          type: 'number',
          label: 'Opacidad (0–1)',
          defaultValue: 1,
          min: 0,
          max: 1,
          admin: { step: 0.05 },
        },
      ],
    },
    {
      name: 'mobileImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen mobile (< 768px)',
      admin: {
        description:
          'En mobile no hay parallax. Esta imagen cubre todo el hero como fondo estático. ' +
          'Diseña una imagen pre-compuesta (texto no, solo la parte visual). ' +
          'En Minery: MR-web-SLIDER-MOVIL.png — combina cielo + montañas + persona en una sola imagen.',
      },
    },
    {
      name: 'mobileTextAlign',
      type: 'select',
      label: 'Alineación del texto en mobile',
      defaultValue: 'center',
      options: [
        { label: 'Centro (por defecto Minery)', value: 'center' },
        { label: 'Izquierda', value: 'left' },
      ],
    },
    {
      name: 'mobileBackgroundColor',
      type: 'text',
      label: 'Color de fondo (bloque superior mobile)',
      defaultValue: '#FFC950',
      admin: {
        description: 'Color hex o CSS del bloque de texto en mobile (< 768px).',
      },
    },
    {
      name: 'height',
      type: 'select',
      label: 'Altura del hero',
      defaultValue: '600',
      options: [
        { label: '500px', value: '500' },
        { label: '600px (por defecto Minery)', value: '600' },
        { label: '700px', value: '700' },
        { label: '100vh (pantalla completa)', value: '100vh' },
      ],
    },
  ],
}
