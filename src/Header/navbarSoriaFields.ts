import type { Field } from 'payload'

import { link } from '@/fields/link'

// ─────────────────────────────────────────────────────────────────────────────
// Navbar Soria — group of fields shown when `type === 'navbarSoria'`.
//
// Layout reference:
//   - Horizontal navbar on desktop: logo (image + optional text fallback) on
//     the left, primary navigation items inline on the right.
//   - On mobile (or always, if the editor prefers) a hamburger button opens
//     a side drawer with the full list of menu items.
//
// We intentionally keep this separate from the existing `navItems` array so
// the original header keeps working untouched and editors can switch between
// "Default" and "Navbar Soria" without losing previous data.
// ─────────────────────────────────────────────────────────────────────────────

export const navbarSoriaGroupField: Field = {
  name: 'navbarSoria',
  type: 'group',
  label: 'Navbar Soria',
  admin: {
    condition: (_, { type } = {}) => type === 'navbarSoria',
    hideGutter: true,
    description:
      'Variante del header con logotipo + barra lateral de menús. En escritorio se muestran los items en línea; en móvil se abre un panel lateral.',
  },
  fields: [
    // ── Branding ────────────────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Logotipo',
          admin: {
            width: '50%',
            description:
              'Imagen del logotipo (preferiblemente SVG o PNG con fondo transparente).',
          },
          filterOptions: { mimeType: { contains: 'image' } },
        },
        {
          name: 'logoText',
          type: 'text',
          label: 'Texto alternativo / fallback',
          admin: {
            width: '50%',
            description:
              'Se muestra junto al logotipo o como reemplazo si no hay imagen. Ej.: "Casa Soria".',
            placeholder: 'Casa Soria',
          },
        },
      ],
    },

    // ── Sidebar / menú principal ────────────────────────────────────────────
    {
      name: 'sidebarItems',
      type: 'array',
      label: 'Items de menú',
      labels: { singular: 'Item', plural: 'Items' },
      maxRows: 10,
      admin: {
        initCollapsed: true,
        description:
          'Lista de enlaces que se muestran en la barra (horizontal en escritorio y dentro del panel lateral en móvil).',
        components: {
          RowLabel: '@/Header/RowLabel#NavbarSoriaRowLabel',
        },
      },
      fields: [
        link({ appearances: false }),
      ],
    },

    // ── CTA opcional ────────────────────────────────────────────────────────
    {
      name: 'cta',
      type: 'group',
      label: 'Botón de acción (opcional)',
      admin: {
        description:
          'Botón destacado al final del menú (por ejemplo, "Reservar"). Déjalo vacío si no quieres mostrarlo.',
      },
      fields: [
        link({ appearances: false }),
      ],
    },

    // ── Apariencia ──────────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Apariencia',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'backgroundColor',
              type: 'text',
              label: 'Color de fondo',
              admin: {
                width: '50%',
                description: 'Opcional. Cualquier color CSS (#hex, rgb, oklch…).',
                placeholder: '#ffffff',
              },
            },
            {
              name: 'textColor',
              type: 'text',
              label: 'Color del texto',
              admin: {
                width: '50%',
                placeholder: '#0b1320',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'sticky',
              type: 'checkbox',
              label: 'Fijar navbar (siempre visible)',
              defaultValue: false,
              admin: {
                width: '50%',
                description:
                  'Si lo activas, el navbar queda siempre fijo arriba. Si lo dejas desactivado, el navbar se oculta al hacer scroll hacia abajo y vuelve a bajar al hacer scroll hacia arriba.',
              },
            },
            {
              name: 'showHamburgerOnDesktop',
              type: 'checkbox',
              label: 'Forzar drawer también en escritorio',
              defaultValue: false,
              admin: {
                width: '50%',
                description:
                  'Si lo activas, el menú lateral se abre siempre con el botón hamburguesa (también en pantallas grandes).',
              },
            },
          ],
        },
      ],
    },
  ],
}
