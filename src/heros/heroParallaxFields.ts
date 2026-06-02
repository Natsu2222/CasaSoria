import type { Field } from 'payload'

export const heroParallaxGroupField: Field = {
  name: 'heroParallax',
  type: 'group',
  label: 'Hero Parallax',
  admin: {
    condition: (_, { type } = {}) => type === 'heroParallax',
    hideGutter: true,
  },
  fields: [
    // ─── TEXTOS ───────────────────────────────────────────────────────────────
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

    // ─── CTA ─────────────────────────────────────────────────────────────────
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

    // ─── CAPAS PARALLAX ───────────────────────────────────────────────────────
    {
      name: 'layers',
      type: 'array',
      label: 'Capas de parallax',
      minRows: 1,
      maxRows: 5,
      admin: {
        description:
          'Añade entre 1 y 5 capas. El orden importa: la primera capa queda detrás, la última delante.',
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
          admin: {
            description: 'Describe la imagen para accesibilidad y SEO.',
          },
        },
        {
          name: 'speed',
          type: 'number',
          label: 'Velocidad parallax',
          min: 0,
          max: 1,
          defaultValue: 0.3,
          admin: {
            step: 0.05,
            description:
              '0 = estática (sin movimiento) · 0.3 = lenta · 0.6 = media · 1 = rápida. Las capas de fondo suelen ir más lentas.',
          },
        },
        {
          name: 'objectFit',
          type: 'select',
          label: 'Ajuste de imagen',
          defaultValue: 'cover',
          options: [
            { label: 'Cover — rellena el espacio (recomendado)', value: 'cover' },
            { label: 'Contain — muestra la imagen completa', value: 'contain' },
            { label: 'Fill — estira la imagen', value: 'fill' },
          ],
        },
        {
          name: 'opacity',
          type: 'number',
          label: 'Opacidad de la capa (0–1)',
          min: 0,
          max: 1,
          defaultValue: 1,
          admin: {
            step: 0.05,
            description:
              'Útil para superponer capas semitransparentes y crear profundidad.',
          },
        },
      ],
    },

    // ─── APARIENCIA ───────────────────────────────────────────────────────────
    {
      name: 'overlayOpacity',
      type: 'number',
      label: 'Opacidad del overlay oscuro (0–1)',
      min: 0,
      max: 1,
      defaultValue: 0.5,
      admin: {
        step: 0.05,
        description:
          'Capa oscura sobre las imágenes para mejorar la legibilidad del texto. 0 = sin overlay.',
      },
    },
    {
      name: 'height',
      type: 'select',
      label: 'Altura del hero',
      defaultValue: 'screen',
      options: [
        { label: 'Pantalla completa (100vh)', value: 'screen' },
        { label: 'Grande (80vh)', value: 'large' },
        { label: 'Mediano (60vh)', value: 'medium' },
      ],
    },
    {
      name: 'textAlign',
      type: 'select',
      label: 'Alineación del texto',
      defaultValue: 'center',
      options: [
        { label: 'Centro', value: 'center' },
        { label: 'Izquierda', value: 'left' },
        { label: 'Derecha', value: 'right' },
      ],
    },
  ],
}
