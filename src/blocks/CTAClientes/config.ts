import type { Block } from 'payload'

export const CTAClientesBlock: Block = {
  slug: 'ctaClientes',
  interfaceName: 'CTAClientesBlock',
  labels: {
    singular: 'CTA Clientes',
    plural: 'CTA Clientes',
  },
  fields: [
    // ─── LOGOS ────────────────────────────────────────────────────────────────
    {
      name: 'logos',
      type: 'array',
      label: 'Logos de clientes',
      minRows: 1,
      maxRows: 30,
      admin: {
        description:
          'Carrusel automático: avanza de logo en logo. Solo se muestran logos enteros (150×150px); los que no caben rotan sin cortarse.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Logo',
          required: true,
          admin: {
            description: 'Imagen cuadrada recomendada (ej. 300×300px).',
          },
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Texto alternativo (alt)',
          admin: { description: 'Ej: "ECIJA Abogados".' },
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL de destino (opcional)',
          admin: { description: 'Si se rellena, el logo será un enlace.' },
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          label: 'Abrir en nueva pestaña',
          defaultValue: false,
        },
      ],
    },

    // ─── ENLACE "VER MÁS" ─────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Enlace "Ver más clientes"',
      fields: [
        {
          name: 'ctaLabel',
          type: 'text',
          label: 'Texto del enlace',
          defaultValue: '+ Clientes',
          admin: { description: 'Dejar vacío para ocultar el enlace.' },
        },
        {
          name: 'ctaUrl',
          type: 'text',
          label: 'URL del enlace',
          defaultValue: '/clientes/',
        },
        {
          name: 'ctaOpenInNewTab',
          type: 'checkbox',
          label: 'Abrir en nueva pestaña',
          defaultValue: false,
        },
      ],
    },

    // ─── CARRUSEL ─────────────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Carrusel',
      fields: [
        {
          name: 'enableCarousel',
          type: 'checkbox',
          label: 'Activar carrusel automático',
          defaultValue: true,
          admin: {
            description:
              'Rota los logos de uno en uno cuando hay más de los que caben en pantalla. ' +
              'Si todos caben, se muestran estáticos.',
          },
        },
        {
          name: 'autoplayDelay',
          type: 'number',
          label: 'Velocidad autoplay (ms)',
          defaultValue: 2500,
          min: 500,
          max: 8000,
          admin: {
            step: 100,
            condition: (_, siblingData) => siblingData?.enableCarousel !== false,
            description: 'Tiempo entre cada cambio de logo.',
          },
        },
        {
          name: 'transitionSpeed',
          type: 'number',
          label: 'Velocidad de transición (ms)',
          defaultValue: 400,
          min: 100,
          max: 1200,
          admin: {
            step: 100,
            condition: (_, siblingData) => siblingData?.enableCarousel !== false,
          },
        },
        {
          name: 'pauseOnHover',
          type: 'checkbox',
          label: 'Pausar al pasar el ratón',
          defaultValue: true,
          admin: {
            condition: (_, siblingData) => siblingData?.enableCarousel !== false,
          },
        },
      ],
    },

    // ─── LAYOUT ───────────────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Layout y espaciado',
      fields: [
        {
          name: 'paddingTop',
          type: 'select',
          label: 'Padding superior',
          defaultValue: '100',
          options: [
            { label: '0px', value: '0' },
            { label: '60px', value: '60' },
            { label: '100px (por defecto Minery)', value: '100' },
            { label: '120px', value: '120' },
          ],
        },
        {
          name: 'paddingBottom',
          type: 'select',
          label: 'Padding inferior',
          defaultValue: '50',
          options: [
            { label: '0px', value: '0' },
            { label: '50px (por defecto Minery)', value: '50' },
            { label: '80px', value: '80' },
            { label: '100px', value: '100' },
          ],
        },
        {
          name: 'hoverScale',
          type: 'select',
          label: 'Escala en hover',
          defaultValue: '1.1',
          options: [
            { label: '1.05 (sutil)', value: '1.05' },
            { label: '1.1 (por defecto)', value: '1.1' },
            { label: '1.15 (notable)', value: '1.15' },
            { label: '1.2 (grande)', value: '1.2' },
          ],
          admin: { description: 'Cuánto crece el logo al pasar el ratón.' },
        },
      ],
    },

    // ─── COLORES ──────────────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Colores',
      fields: [
        {
          name: 'backgroundColor',
          type: 'text',
          label: 'Color de fondo de la sección',
          defaultValue: '#ffffff',
        },
        {
          name: 'ctaColor',
          type: 'text',
          label: 'Color del enlace "Ver más"',
          defaultValue: '#1e1e1c',
        },
        {
          name: 'ctaHoverColor',
          type: 'text',
          label: 'Color del enlace en hover',
          defaultValue: '#FFC950',
        },
      ],
    },
  ],
}
