import type { Block } from 'payload'

import { fontFamilySelectField } from '@/fields/fontFamilySelect'

export const LayoutSoria2Block: Block = {
  slug: 'layoutSoria2',
  interfaceName: 'LayoutSoria2Block',
  labels: {
    singular: 'Layout Soria 2',
    plural: 'Layout Soria 2',
  },
  fields: [
    {
      name: 'anchorId',
      type: 'text',
      label: 'ID ancla',
      admin: {
        description:
          'Opcional. ID para enlaces ancla (ej: compromiso). Solo letras, números, guiones y guión bajo.',
      },
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Título principal',
      required: true,
      defaultValue: 'Comprometidos con tu hogar y negocio',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción',
      admin: {
        description: 'Texto bajo el título (párrafo introductorio).',
      },
    },
    {
      name: 'stats',
      type: 'array',
      dbName: 'ls2_st',
      label: 'Estadísticas (tarjetas)',
      admin: {
        description:
          'Tarjetas blancas con número destacado y etiqueta (p. ej. 1000+ / Clientes satisfechos).',
      },
      minRows: 0,
      maxRows: 6,
      fields: [
        {
          name: 'value',
          type: 'text',
          label: 'Número o valor',
          required: true,
          admin: { description: 'Ej.: 1000+, 25+' },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Etiqueta',
          required: true,
          admin: { description: 'Ej.: Clientes satisfechos' },
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen principal',
      required: true,
    },
    {
      name: 'imageAlt',
      type: 'text',
      label: 'Texto alternativo de la imagen',
      admin: {
        description: 'Si lo dejas vacío, se usa el alt de la imagen en la librería.',
      },
    },
    {
      name: 'imagePosition',
      type: 'select',
      label: 'Posición de la imagen (escritorio)',
      defaultValue: 'right',
      options: [
        { label: 'Derecha (texto izquierda)', value: 'right' },
        { label: 'Izquierda (texto derecha)', value: 'left' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'backgroundColor',
          type: 'text',
          label: 'Color de fondo del bloque',
          defaultValue: '#1a1a1a',
          admin: { placeholder: '#1a1a1a' },
        },
        {
          name: 'headingColor',
          type: 'text',
          label: 'Color del título',
          defaultValue: '#ffffff',
          admin: { placeholder: '#ffffff' },
        },
        {
          name: 'descriptionColor',
          type: 'text',
          label: 'Color de la descripción',
          defaultValue: '#f5f5f5',
          admin: { placeholder: '#f5f5f5' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'statCardBackground',
          type: 'text',
          label: 'Fondo de las tarjetas',
          defaultValue: '#ffffff',
          admin: { placeholder: '#ffffff' },
        },
        {
          name: 'statNumberColor',
          type: 'text',
          label: 'Color del número',
          defaultValue: '#0a0a0a',
          admin: { placeholder: '#0a0a0a' },
        },
        {
          name: 'statLabelColor',
          type: 'text',
          label: 'Color de la etiqueta',
          defaultValue: '#404040',
          admin: { placeholder: '#404040' },
        },
      ],
    },
    {
      name: 'cornerRadius',
      type: 'number',
      label: 'Radio de esquinas (px)',
      min: 8,
      max: 28,
      defaultValue: 16,
      admin: { description: 'Tarjetas e imagen (mismo radio).' },
    },
    fontFamilySelectField(),
  ],
}
