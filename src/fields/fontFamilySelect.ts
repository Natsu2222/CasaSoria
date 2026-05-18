import type { SelectField } from 'payload'

export const fontFamilySelectField = (): SelectField => ({
  name: 'fontFamily',
  type: 'select',
  label: 'Tipografía',
  defaultValue: 'default',
  admin: {
    description:
      'Por defecto usa la misma tipografía que el hero MicroVisuals (Instrument Serif + Barlow).',
  },
  options: [
    { label: 'Por defecto (MicroVisuals)', value: 'default' },
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Times New Roman', value: '"Times New Roman", serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Verdana', value: 'Verdana, sans-serif' },
    { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
    { label: 'Courier New', value: '"Courier New", monospace' },
    { label: 'Roboto', value: '"Roboto", sans-serif' },
    { label: 'Open Sans', value: '"Open Sans", sans-serif' },
    { label: 'Lato', value: '"Lato", sans-serif' },
    { label: 'Montserrat', value: '"Montserrat", sans-serif' },
    { label: 'Playfair Display', value: '"Playfair Display", serif' },
    { label: 'Inter', value: '"Inter", sans-serif' },
    { label: 'Poppins', value: '"Poppins", sans-serif' },
    { label: 'Raleway', value: '"Raleway", sans-serif' },
  ],
})

export function resolveFontFamily(fontFamily: string | null | undefined): string | undefined {
  if (!fontFamily || fontFamily === 'default') return undefined
  return fontFamily
}
