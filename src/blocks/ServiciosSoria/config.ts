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

import { fontFamilySelectField } from '@/fields/fontFamilySelect'
import { link } from '@/fields/link'

// Rich-text variants that align with the MicroVisuals hero look (light weights,
// crisp display headings). Pickable from the floating toolbar in the admin.
const serviciosSoriaTextState = {
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
      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3'] }),
      AlignFeature(),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      TextStateFeature({ state: serviciosSoriaTextState }),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  })

const bodyEditor = () =>
  lexicalEditor({
    features: ({ rootFeatures }) => [
      ...rootFeatures,
      ParagraphFeature(),
      AlignFeature(),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      UnorderedListFeature(),
      LinkFeature({ enabledCollections: ['pages', 'posts'] }),
      TextStateFeature({ state: serviciosSoriaTextState }),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  })

// Lightweight editor for the bottom badge on each card — keep it small,
// inline-only formatting, no headings or lists.
const labelEditor = () =>
  lexicalEditor({
    features: () => [
      ParagraphFeature(),
      BoldFeature(),
      ItalicFeature(),
      TextStateFeature({ state: serviciosSoriaTextState }),
      InlineToolbarFeature(),
    ],
  })

export const ServiciosSoriaBlock: Block = {
  slug: 'serviciosSoria',
  interfaceName: 'ServiciosSoriaBlock',
  labels: {
    singular: 'Servicios Soria',
    plural: 'Servicios Soria Blocks',
  },
  fields: [
    // ─── Header ────────────────────────────────────────────────────────────
    {
      name: 'anchorId',
      type: 'text',
      label: 'ID ancla',
      admin: {
        description: 'ID opcional para enlaces ancla (ej: servicios).',
      },
    },
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow (texto pequeño sobre el título)',
      admin: { description: 'Opcional. Línea breve encima del título.' },
    },
    {
      name: 'title',
      type: 'richText',
      label: 'Título',
      editor: headlineEditor(),
      admin: {
        description:
          'Encabezado principal del bloque. Por defecto se renderiza con el mismo estilo que el headline del hero MicroVisuals.',
      },
    },
    {
      name: 'subtitle',
      type: 'richText',
      label: 'Subtítulo',
      editor: bodyEditor(),
      admin: {
        description: 'Párrafo descriptivo bajo el título.',
      },
    },

    // ─── Cards ─────────────────────────────────────────────────────────────
    {
      name: 'services',
      type: 'array',
      label: 'Servicios',
      minRows: 1,
      maxRows: 12,
      labels: { singular: 'Servicio', plural: 'Servicios' },
      admin: {
        initCollapsed: false,
        description:
          'Cada elemento es una tarjeta del carrusel. La primera tarjeta arranca expandida; las demás aparecen como tarjetas pequeñas a su lado y se expanden al hacer click o cuando el autoplay las selecciona.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Imagen de fondo',
          filterOptions: {
            mimeType: { contains: 'image' },
          },
          admin: {
            description: 'Imagen que ocupa toda la tarjeta. Idealmente 1200×1500 o vertical.',
          },
        },
        {
          name: 'label',
          type: 'richText',
          editor: labelEditor(),
          label: 'Etiqueta inferior',
          admin: {
            description:
              'Texto corto que aparece siempre en la esquina inferior de la tarjeta (badge tipo "Compra en tienda").',
          },
        },
        {
          name: 'description',
          type: 'richText',
          editor: bodyEditor(),
          label: 'Descripción (solo tarjeta expandida)',
          admin: {
            description:
              'Texto descriptivo que aparece bajo la etiqueta cuando la tarjeta está expandida.',
          },
        },
        link({
          appearances: false,
          overrides: {
            name: 'cta',
            label: 'CTA superior (botón blanco arriba a la derecha)',
            admin: {
              description:
                'Opcional. Aparece arriba a la derecha cuando la tarjeta está expandida. Si no hay label, no se muestra el botón.',
            },
          },
        }),
      ],
    },

    // ─── Carousel behavior ─────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'autoplay',
          type: 'checkbox',
          label: 'Avance automático',
          defaultValue: true,
          admin: { width: '50%' },
        },
        {
          name: 'autoplayMs',
          type: 'number',
          label: 'Intervalo entre cambios (ms)',
          defaultValue: 4500,
          min: 1500,
          max: 20000,
          admin: {
            condition: (_, siblingData) => siblingData?.autoplay !== false,
            width: '50%',
            step: 500,
            description: 'Solo aplica si "Avance automático" está activo.',
          },
        },
      ],
    },

    // ─── Appearance & typography (optional) ────────────────────────────
    {
      name: 'backgroundColor',
      type: 'text',
      label: 'Color de fondo del bloque',
      admin: {
        description: 'Opcional. Cualquier color CSS (#hex, rgb, oklch, etc.).',
      },
    },

    // ── Title appearance ────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'titleColor',
          type: 'text',
          label: 'Color del título',
          admin: {
            width: '50%',
            description: 'Opcional. Por defecto hereda el color del bloque.',
          },
        },
        fontFamilySelectField({
          name: 'titleFontFamily',
          label: 'Tipografía del título',
          width: '50%',
          description: 'Por defecto usa el estilo display del hero MicroVisuals.',
        }),
      ],
    },

    // ── Subtitle appearance ─────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'subtitleColor',
          type: 'text',
          label: 'Color del subtítulo',
          admin: {
            width: '50%',
            description: 'Opcional.',
          },
        },
        fontFamilySelectField({
          name: 'subtitleFontFamily',
          label: 'Tipografía del subtítulo',
          width: '50%',
          description: 'Por defecto usa el cuerpo de texto MicroVisuals (Barlow).',
        }),
      ],
    },

    // ── Card text appearance (label + description) ──────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'cardTextColor',
          type: 'text',
          label: 'Color del texto en tarjetas',
          admin: {
            width: '50%',
            description: 'Aplica al label y a la descripción dentro de cada tarjeta.',
          },
        },
        fontFamilySelectField({
          name: 'cardFontFamily',
          label: 'Tipografía del texto en tarjetas',
          width: '50%',
          description: 'Aplica al label y a la descripción dentro de cada tarjeta.',
        }),
      ],
    },

    // ── CTA button appearance (top-right pill on the active card) ───────
    {
      type: 'row',
      fields: [
        {
          name: 'ctaBackgroundColor',
          type: 'text',
          label: 'Fondo del botón CTA',
          admin: {
            width: '33%',
            description: 'Opcional. Por defecto blanco semitransparente.',
            placeholder: '#ffffff',
          },
        },
        {
          name: 'ctaTextColor',
          type: 'text',
          label: 'Color del texto del CTA',
          admin: {
            width: '33%',
            description: 'Opcional. Por defecto usa el color de primer plano.',
          },
        },
        fontFamilySelectField({
          name: 'ctaFontFamily',
          label: 'Tipografía del CTA',
          width: '34%',
          description: 'Tipografía del botón superior cuando la tarjeta está activa.',
        }),
      ],
    },
  ],
}
