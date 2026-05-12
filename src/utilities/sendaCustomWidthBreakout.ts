export const SENDA_CUSTOM_BREAKOUT_ATTR = 'data-senda-custom-breakout'

export function sendaCalcBreakoutInlineStyle(widthVw: number): Record<string, unknown> {
  const w = Number.isFinite(widthVw) ? Math.min(100, Math.max(0, widthVw)) : 100
  return {
    width: `${w}vw`,
    marginLeft: '50%',
    transform: 'translateX(-50%)',
    maxWidth: 'none',
  }
}

export function sendaBreakoutOnlyBoxSizing(): Record<string, unknown> {
  return { boxSizing: 'border-box' }
}

export function sendaResolveOptionalMobileWidthVw(
  enabled: boolean | null | undefined,
  mobilePercent: number | null | undefined,
): number | null {
  if (enabled !== true) return null
  if (typeof mobilePercent !== 'number' || !Number.isFinite(mobilePercent)) return null
  const clamped = Math.min(100, Math.max(0, mobilePercent))
  return clamped <= 0 ? 100 : clamped
}

export function buildSendaCalcBreakoutResponsiveCss(
  styleId: string,
  desktopWidthVw: number,
  mobileWidthVw: number,
): string {
  const d = Number.isFinite(desktopWidthVw) ? Math.min(100, Math.max(0, desktopWidthVw)) : 100
  const m = Number.isFinite(mobileWidthVw) ? Math.min(100, Math.max(0, mobileWidthVw)) : d

  const sel = `[${SENDA_CUSTOM_BREAKOUT_ATTR}="${styleId}"]`
  return `
${sel} {
  width: ${d}vw;
  margin-left: 50%;
  transform: translateX(-50%);
  max-width: none;
}
@media (max-width: 768px) {
  ${sel} {
    width: ${m}vw;
  }
}
`.trim()
}

