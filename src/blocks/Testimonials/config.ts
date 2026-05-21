import type { Block } from 'payload'

import {
  AlignFeature,
  BoldFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  ParagraphFeature,
  TextStateFeature,
  UnderlineFeature,
} from '@payloadcms/richtext-lexical'

import { fontFamilySelectField } from '@/fields/fontFamilySelect'

// Pesos rápidos disponibles en la toolbar flotante del editor.
const testimonialsTextState = {
  weight: {
    light: { label: 'Light', css: { 'font-weight': '300' } },
    regular: { label: 'Regular', css: { 'font-weight': '400' } },
    medium: { label: 'Medium', css: { 'font-weight': '500' } },
    semibold: { label: 'Semibold', css: { 'font-weight': '600' } },
    heavy: { label: 'Heavy', css: { 'font-weight': '800' } },
  },
} as const

// Editor para textos largos: cita, atribución, etc.
const richEditor = () =>
  lexicalEditor({
    features: ({ rootFeatures }) => [
      ...rootFeatures,
      ParagraphFeature(),
      AlignFeature(),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      LinkFeature({ enabledCollections: ['pages', 'posts'] }),
      TextStateFeature({ state: testimonialsTextState }),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  })

// Editor compacto para nombre / rol (sin headings ni listas).
const inlineEditor = () =>
  lexicalEditor({
    features: () => [
      ParagraphFeature(),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      TextStateFeature({ state: testimonialsTextState }),
      InlineToolbarFeature(),
    ],
  })

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: {
    singular: 'Bloque Testimonios',
    plural: 'Bloques Testimonios',
  },
  fields: [
    // ─── Cabecera ────────────────────────────────────────────────────────
    {
      name: 'anchorId',
      type: 'text',
      label: 'ID ancla',
      admin: {
        description: 'ID opcional para enlaces ancla (ej: testimonios).',
      },
    },

    // ─── Imagen de fondo (panel izquierdo) ───────────────────────────────
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Imagen de fondo',
      filterOptions: {
        mimeType: { contains: 'image' },
      },
      admin: {
        description:
          'Imagen que ocupa el panel izquierdo del bloque. Idealmente paisaje, mínimo 1600px de ancho.',
      },
    },

    // ─── Testimonios ─────────────────────────────────────────────────────
    {
      name: 'items',
      type: 'array',
      label: 'Testimonios',
      minRows: 1,
      labels: { singular: 'Testimonio', plural: 'Testimonios' },
      admin: {
        initCollapsed: false,
        description:
          'Cada elemento es un testimonio que el usuario puede navegar con las flechas o los puntos.',
      },
      fields: [
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
          label: 'Foto del usuario',
          filterOptions: {
            mimeType: { contains: 'image' },
          },
          admin: {
            description: 'Foto circular que aparece sobre la cita. Cuadrada, mínimo 200×200.',
          },
        },
        {
          name: 'quote',
          type: 'richText',
          label: 'Cita',
          editor: richEditor(),
          required: true,
          admin: {
            description: 'Texto principal del testimonio.',
          },
        },
        {
          name: 'attribution',
          type: 'richText',
          label: 'Atribución (opcional)',
          editor: richEditor(),
          admin: {
            description:
              'Línea pequeña bajo la cita (ej: "Images from Freepik"). Acepta enlaces.',
          },
        },
        {
          name: 'name',
          type: 'richText',
          label: 'Nombre',
          editor: inlineEditor(),
          required: true,
        },
        {
          name: 'role',
          type: 'richText',
          label: 'Cargo / rol',
          editor: inlineEditor(),
        },
      ],
    },

    // ─── Comportamiento del carrusel ─────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'autoplay',
          type: 'checkbox',
          label: 'Avance automático',
          defaultValue: false,
          admin: {
            width: '50%',
            description: 'Si está marcado, los testimonios cambian uno a uno automáticamente.',
          },
        },
        {
          name: 'autoplayMs',
          type: 'number',
          label: 'Intervalo entre cambios (ms)',
          defaultValue: 5000,
          min: 1500,
          max: 20000,
          admin: {
            condition: (_, siblingData) => siblingData?.autoplay === true,
            width: '50%',
            step: 500,
            description: 'Solo aplica si "Avance automático" está activo.',
          },
        },
      ],
    },

    // ─── Apariencia — Sección ────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Apariencia — Sección',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'backgroundColor',
              type: 'text',
              label: 'Color de fondo de la sección',
              admin: {
                width: '50%',
                description: 'Color base detrás de la imagen. Por defecto: blanco.',
                placeholder: '#ffffff',
              },
            },
            {
              name: 'accentColor',
              type: 'text',
              label: 'Color del panel decorativo',
              admin: {
                width: '50%',
                description:
                  'Color sólido del panel a la derecha de la imagen (como el azul oscuro del diseño). Por defecto: #143b5b.',
                placeholder: '#143b5b',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'maxWidth',
              type: 'text',
              label: 'Ancho máximo del bloque',
              admin: {
                width: '50%',
                description:
                  'Por defecto: 100% (ancho completo, sin márgenes laterales). Ej: 72rem, 1200px.',
                placeholder: '100%',
              },
            },
            {
              name: 'minHeight',
              type: 'text',
              label: 'Alto mínimo',
              admin: {
                width: '50%',
                description: 'Por defecto: 460px. Ej: 520px, 60vh.',
                placeholder: '460px',
              },
            },
          ],
        },
      ],
    },

    // ─── Apariencia — Tarjeta blanca ─────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Apariencia — Tarjeta de testimonio',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'cardBackgroundColor',
              type: 'text',
              label: 'Color de fondo de la tarjeta',
              admin: {
                width: '50%',
                description: 'Por defecto: blanco.',
                placeholder: '#ffffff',
              },
            },
            {
              name: 'cardShadow',
              type: 'text',
              label: 'Sombra de la tarjeta',
              admin: {
                width: '50%',
                description:
                  'Cualquier valor CSS de box-shadow. Por defecto: 0 30px 60px -30px rgba(0,0,0,0.35).',
                placeholder: '0 30px 60px -30px rgba(0,0,0,0.35)',
              },
            },
          ],
        },
      ],
    },

    // ─── Apariencia — Cita ───────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Apariencia — Cita',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'quoteColor',
              type: 'text',
              label: 'Color de la cita',
              admin: {
                width: '50%',
                description: 'Por defecto: gris oscuro.',
                placeholder: '#475569',
              },
            },
            fontFamilySelectField({
              name: 'quoteFontFamily',
              label: 'Tipografía de la cita',
              width: '50%',
            }),
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'attributionColor',
              type: 'text',
              label: 'Color de la atribución',
              admin: {
                width: '50%',
                description: 'Por defecto: gris medio.',
                placeholder: '#64748b',
              },
            },
            fontFamilySelectField({
              name: 'attributionFontFamily',
              label: 'Tipografía de la atribución',
              width: '50%',
            }),
          ],
        },
      ],
    },

    // ─── Apariencia — Nombre y cargo ─────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Apariencia — Nombre y cargo',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'nameColor',
              type: 'text',
              label: 'Color del nombre',
              admin: {
                width: '50%',
                description: 'Por defecto: negro.',
                placeholder: '#0a0a0a',
              },
            },
            fontFamilySelectField({
              name: 'nameFontFamily',
              label: 'Tipografía del nombre',
              width: '50%',
            }),
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'roleColor',
              type: 'text',
              label: 'Color del cargo',
              admin: {
                width: '50%',
                description: 'Por defecto: gris medio.',
                placeholder: '#64748b',
              },
            },
            fontFamilySelectField({
              name: 'roleFontFamily',
              label: 'Tipografía del cargo',
              width: '50%',
            }),
          ],
        },
      ],
    },

    // ─── Apariencia — Controles (flechas + puntos) ───────────────────────
    {
      type: 'collapsible',
      label: 'Apariencia — Controles (flechas y puntos)',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'arrowColor',
              type: 'text',
              label: 'Color de las flechas',
              admin: {
                width: '50%',
                description: 'Por defecto: gris oscuro.',
                placeholder: '#0a0a0a',
              },
            },
            {
              name: 'arrowBackgroundColor',
              type: 'text',
              label: 'Color de fondo de las flechas',
              admin: {
                width: '50%',
                description: 'Por defecto: transparente.',
                placeholder: 'transparent',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'dotColor',
              type: 'text',
              label: 'Color de los puntos',
              admin: {
                width: '50%',
                description: 'Por defecto: gris claro.',
                placeholder: '#cbd5e1',
              },
            },
            {
              name: 'dotActiveColor',
              type: 'text',
              label: 'Color del punto activo',
              admin: {
                width: '50%',
                description: 'Por defecto: negro.',
                placeholder: '#0a0a0a',
              },
            },
          ],
        },
      ],
    },
  ],
}
