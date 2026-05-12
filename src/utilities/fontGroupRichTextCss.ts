export const FONT_GROUP_RICHTEXT_DESKTOP_MIN = 1024
export const FONT_GROUP_RICHTEXT_MOBILE_MAX = 767

export type FontGroupTypography = {
  h1?: string | null
  h2?: string | null
  h3?: string | null
  h4?: string | null
  h5?: string | null
  h6?: string | null
  body?: string | null
  caption?: string | null
} | null

export type FontGroupHeadingMargins = Record<string, unknown> | null
export type FontGroupLineHeights = {
  body?: string | null
} | null

export const FONT_GROUP_VARIANT_CSS: Record<string, { weight: string; style: string }> = {
  light: { weight: '300', style: 'normal' },
  regular: { weight: '400', style: 'normal' },
  medium: { weight: '500', style: 'normal' },
  semibold: { weight: '600', style: 'normal' },
  bold: { weight: '700', style: 'normal' },
  heavy: { weight: '800', style: 'normal' },
  italic: { weight: '400', style: 'italic' },
}

export function trimFontGroupValue(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const t = value.trim()
  return t ? t : null
}

export function mergeFontGroupLineHeightsWithFallback(
  desktop: FontGroupLineHeights,
  mobile: FontGroupLineHeights,
): FontGroupLineHeights {
  if (desktop && typeof desktop === 'object') return desktop
  if (mobile && typeof mobile === 'object') return mobile
  return null
}

export function appendTypographyBodyListSizeRules(
  _typography: FontGroupTypography,
  _mainRichtextSel: string,
  _planRichtextSel: string,
  _payloadRichtextSel: string,
  _pushRule: (rule: string) => void,
): void {
  // No-op shim (feature not implemented in this project yet).
}

export function appendFontGroupHeadingMarginRulesResponsive(
  _desktop: FontGroupHeadingMargins,
  _mobile: FontGroupHeadingMargins,
  _mainRichtextSel: string,
  _planRichtextSel: string,
  _payloadRichtextSel: string,
  _pushRule: (rule: string) => void,
): void {
  // No-op shim.
}

export function appendFontGroupLineHeightRulesResponsive(
  _desktop: FontGroupLineHeights,
  _mobile: FontGroupLineHeights,
  _mainRichtextSel: string,
  _planRichtextSel: string,
  _payloadRichtextSel: string,
  _pushRule: (rule: string) => void,
): void {
  // No-op shim.
}

