import type { Field } from 'payload'

export const heroParallax2GroupField: Field = {
  name: 'heroParallax2',
  type: 'group',
  label: 'Hero Parallax 2',
  admin: {
    condition: (_, { type } = {}) => type === 'heroParallax2',
    hideGutter: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título principal',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
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
      ],
    },
    {
      name: 'leftBgColor',
      type: 'text',
      label: 'Color de fondo (columna izquierda)',
      defaultValue: '#FFC950',
      admin: {
        description: 'Color hex o CSS. Ej: #FFC950, white, rgb(255,201,80)',
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
          'Imagen que cubre todo el hero detrás de las capas parallax. En Minery es una textura/foto de fondo.',
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
