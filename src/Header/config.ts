import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'
import { navbarSoriaGroupField } from './navbarSoriaFields'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    // ── Variante del header ─────────────────────────────────────────────────
    // El campo `type` permite elegir entre el header por defecto (legacy)
    // y la nueva variante "Navbar Soria". Los campos específicos de cada
    // variante se ocultan/muestran condicionalmente para no abrumar al editor.
    {
      name: 'type',
      type: 'select',
      defaultValue: 'default',
      label: 'Tipo de header',
      required: true,
      options: [
        { label: 'Default (logo Payload + nav items)', value: 'default' },
        { label: 'Navbar Soria (logo + barra lateral)', value: 'navbarSoria' },
      ],
      admin: {
        description:
          'Elige qué navbar quieres usar en la web. Al cambiar de tipo, los campos específicos se mostrarán u ocultarán automáticamente.',
      },
    },

    // ── Variante por defecto ────────────────────────────────────────────────
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        condition: (_, { type } = {}) => type !== 'navbarSoria',
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },

    // ── Navbar Soria ────────────────────────────────────────────────────────
    navbarSoriaGroupField,
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
