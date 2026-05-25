import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'
import { footerSoriaGroupField } from './footerSoriaFields'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'default',
      label: 'Tipo de footer',
      required: true,
      options: [
        { label: 'Default (logo Payload + nav items)', value: 'default' },
        { label: 'Footer Soria (social + marca + legal)', value: 'footerSoria' },
      ],
      admin: {
        description:
          'Elige qué footer quieres usar en la web. Al cambiar de tipo, los campos específicos se mostrarán u ocultarán automáticamente.',
      },
    },

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
        condition: (_, { type } = {}) => type !== 'footerSoria',
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },

    footerSoriaGroupField,
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
