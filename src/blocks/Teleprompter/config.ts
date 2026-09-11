import type { Block } from 'payload'

const FONT_OPTIONS = [
  { label: 'Montserrat (por defecto)', value: 'Montserrat, sans-serif' },
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Lato', value: 'Lato, sans-serif' },
  { label: 'Open Sans', value: 'Open Sans, sans-serif' },
  { label: 'Raleway', value: 'Raleway, sans-serif' },
  { label: 'Poppins', value: 'Poppins, sans-serif' },
  { label: 'Playfair Display', value: 'Playfair Display, serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
]

/**
 * Teleprompter
 * ────────────
 * Ticker horizontal infinito. Replica el efecto #teleprompter-infinite
 * de Minery Report (/digitalizacion/legalsoft/).
 *
 * Implementación: los ítems se duplican en el DOM y se animan con
 * CSS @keyframes translateX para crear un loop perfecto sin JavaScript.
 *
 * Cada ítem puede ser texto puro, icono (imagen upload) + texto,
 * o icono solo. Entre ítems se puede añadir un separador configurable.
 */
export const TeleprompterBlock: Block = {
  slug: 'teleprompter',
  interfaceName: 'TeleprompterBlock',
  labels: {
    singular: 'Teleprompter / Marquee',
    plural: 'Teleprompters / Marquees',
  },
  fields: [

    // ─── ÍTEMS ────────────────────────────────────────────────────────────────
    {
      name: 'items',
      type: 'array',
      label: 'Ítems del ticker',
      minRows: 1,
      maxRows: 50,
      admin: {
        description:
          'Cada ítem puede ser texto, icono + texto, o solo icono. ' +
          'Los ítems se duplican automáticamente para el loop infinito.',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Texto',
          admin: { description: 'Dejar vacío si solo quieres mostrar el icono.' },
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'Icono / Imagen (opcional)',
          admin: {
            description: 'SVG o PNG. Se muestra a la izquierda del texto.',
          },
        },
        {
          name: 'iconAlt',
          type: 'text',
          label: 'Alt del icono',
          admin: {
            condition: (_, siblingData) => !!siblingData?.icon,
          },
        },
      ],
    },

    // ─── SEPARADOR ────────────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Separador entre ítems',
      fields: [
        {
          name: 'separatorType',
          type: 'select',
          label: 'Tipo de separador',
          defaultValue: 'none',
          options: [
            { label: 'Ninguno', value: 'none' },
            { label: 'Punto •', value: 'dot' },
            { label: 'Barra |', value: 'pipe' },
            { label: 'Rombo ◆', value: 'diamond' },
            { label: 'Guión —', value: 'dash' },
            { label: 'Flecha →', value: 'arrow' },
            { label: 'Personalizado', value: 'custom' },
          ],
        },
        {
          name: 'separatorCustom',
          type: 'text',
          label: 'Separador personalizado',
          admin: {
            description: 'Cualquier carácter o emoji. Ej: ★ / ✦ / ➤',
            condition: (_, siblingData) => siblingData?.separatorType === 'custom',
          },
        },
        {
          name: 'separatorColor',
          type: 'text',
          label: 'Color del separador',
          defaultValue: '#FFC950',
          admin: {
            condition: (_, siblingData) => siblingData?.separatorType !== 'none',
          },
        },
      ],
    },

    // ─── ANIMACIÓN ────────────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Animación',
      fields: [
        {
          name: 'direction',
          type: 'select',
          label: 'Dirección del desplazamiento',
          defaultValue: 'left',
          options: [
            { label: '← Izquierda (por defecto, igual que Minery)', value: 'left' },
            { label: '→ Derecha', value: 'right' },
          ],
        },
        {
          name: 'speed',
          type: 'number',
          label: 'Velocidad (segundos para un ciclo completo)',
          defaultValue: 30,
          min: 5,
          max: 120,
          admin: {
            step: 5,
            description:
              'Menor número = más rápido. 30s ≈ velocidad moderada. ' +
              'El ciclo se ajusta automáticamente según el número de ítems.',
          },
        },
        {
          name: 'pauseOnHover',
          type: 'checkbox',
          label: 'Pausar al pasar el ratón',
          defaultValue: true,
        },
      ],
    },

    // ─── LAYOUT ───────────────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Layout y tamaños',
      fields: [
        {
          name: 'height',
          type: 'select',
          label: 'Alto del teleprompter',
          defaultValue: '80',
          options: [
            { label: '40px', value: '40' },
            { label: '60px', value: '60' },
            { label: '80px (por defecto)', value: '80' },
            { label: '100px', value: '100' },
            { label: '120px', value: '120' },
            { label: '160px', value: '160' },
            { label: '200px', value: '200' },
            { label: '240px', value: '240' },
            { label: '280px', value: '280' },
            { label: '320px', value: '320' },
            { label: '360px', value: '360' },
            { label: '400px', value: '400' },
            { label: '480px', value: '480' },
            { label: '560px', value: '560' },
            { label: '640px', value: '640' },
          ],
        },
        {
          name: 'itemGap',
          type: 'select',
          label: 'Separación entre ítems',
          defaultValue: '48',
          options: [
            { label: '16px', value: '16' },
            { label: '24px', value: '24' },
            { label: '32px', value: '32' },
            { label: '48px (por defecto)', value: '48' },
            { label: '64px', value: '64' },
            { label: '80px', value: '80' },
            { label: '96px', value: '96' },
            { label: '128px', value: '128' },
            { label: '160px', value: '160' },
            { label: '200px', value: '200' },
          ],
        },
        {
          name: 'iconSize',
          type: 'select',
          label: 'Tamaño de los iconos',
          defaultValue: '48',
          options: [
            { label: '48px (por defecto)', value: '48' },
            { label: '64px', value: '64' },
            { label: '80px', value: '80' },
            { label: '96px', value: '96' },
            { label: '128px', value: '128' },
            { label: '160px', value: '160' },
            { label: '192px', value: '192' },
            { label: '224px', value: '224' },
            { label: '256px', value: '256' },
            { label: '288px', value: '288' },
            { label: '320px', value: '320' },
            { label: '360px', value: '360' },
            { label: '400px', value: '400' },
            { label: '480px', value: '480' },
            { label: '560px', value: '560' },
            { label: '640px', value: '640' },
          ],
        },
        {
          name: 'fontSize',
          type: 'select',
          label: 'Tamaño del texto',
          defaultValue: '16',
          options: [
            { label: '12px', value: '12' },
            { label: '14px', value: '14' },
            { label: '16px (por defecto)', value: '16' },
            { label: '18px', value: '18' },
            { label: '20px', value: '20' },
            { label: '24px', value: '24' },
            { label: '28px', value: '28' },
            { label: '32px', value: '32' },
          ],
        },
        {
          name: 'fontWeight',
          type: 'select',
          label: 'Grosor del texto',
          defaultValue: '500',
          options: [
            { label: 'Normal (400)', value: '400' },
            { label: 'Medio (500)', value: '500' },
            { label: 'Semibold (600)', value: '600' },
            { label: 'Bold (700)', value: '700' },
            { label: 'Extrabold (800)', value: '800' },
          ],
        },
      ],
    },

    // ─── TIPOGRAFÍA ───────────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Tipografía',
      fields: [
        {
          name: 'font',
          type: 'select',
          label: 'Fuente',
          defaultValue: 'Montserrat, sans-serif',
          options: FONT_OPTIONS,
        },
        {
          name: 'textTransform',
          type: 'select',
          label: 'Transformación del texto',
          defaultValue: 'none',
          options: [
            { label: 'Normal', value: 'none' },
            { label: 'MAYÚSCULAS', value: 'uppercase' },
            { label: 'minúsculas', value: 'lowercase' },
            { label: 'Capitalizado', value: 'capitalize' },
          ],
        },
        {
          name: 'letterSpacing',
          type: 'select',
          label: 'Espaciado entre letras',
          defaultValue: '0',
          options: [
            { label: 'Normal', value: '0' },
            { label: 'Amplio (1px)', value: '1' },
            { label: 'Más amplio (2px)', value: '2' },
            { label: 'Tracking wide (3px)', value: '3' },
          ],
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
          label: 'Color de fondo',
          defaultValue: '#1e1e1c',
          admin: { description: 'Color hex o CSS. Ej: #1e1e1c, #FFC950, transparent.' },
        },
        {
          name: 'textColor',
          type: 'text',
          label: 'Color del texto',
          defaultValue: '#ffffff',
        },
        {
          name: 'iconTint',
          type: 'text',
          label: 'Tint de los iconos (CSS filter, opcional)',
          admin: {
            description:
              'Ej: "brightness(0) invert(1)" para iconos blancos. ' +
              'Dejar vacío para usar el color original del icono.',
          },
        },
        {
          name: 'borderTop',
          type: 'text',
          label: 'Borde superior (opcional)',
          admin: { description: 'Ej: "1px solid rgba(255,255,255,0.15)". Dejar vacío para ninguno.' },
        },
        {
          name: 'borderBottom',
          type: 'text',
          label: 'Borde inferior (opcional)',
          admin: { description: 'Ej: "1px solid rgba(255,255,255,0.15)".' },
        },
      ],
    },
  ],
}
