import type { SelectField } from 'payload'

type FontFamilySelectOverrides = {
  /** Field `name` used by Payload. Defaults to `'fontFamily'`. */
  name?: string
  /** Admin label shown to editors. Defaults to `'Tipografía'`. */
  label?: string
  /** Override the help text below the field in the admin. */
  description?: string
  /** Default selected value. Defaults to `'default'` (MicroVisuals look). */
  defaultValue?: string
  /** Width when placed inside a `row` field (e.g. `'50%'`). */
  width?: string
}

const FONT_FAMILY_OPTIONS: SelectField['options'] = [
  { label: 'Por defecto (MicroVisuals)', value: 'default' },
  { label: 'Instrument Serif (italic display)', value: '"Instrument Serif", serif' },
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
]

export const fontFamilySelectField = (
  overrides: FontFamilySelectOverrides = {},
): SelectField => {
  const {
    name = 'fontFamily',
    label = 'Tipografía',
    description = 'Por defecto usa la misma tipografía que el hero MicroVisuals (Instrument Serif + Barlow).',
    defaultValue = 'default',
    width,
  } = overrides

  return {
    name,
    type: 'select',
    label,
    defaultValue,
    admin: {
      description,
      ...(width ? { width } : {}),
    },
    options: FONT_FAMILY_OPTIONS,
  }
}

export function resolveFontFamily(fontFamily: string | null | undefined): string | undefined {
  if (!fontFamily || fontFamily === 'default') return undefined
  return fontFamily
}
