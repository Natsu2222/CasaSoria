import * as React from 'react'

/**
 * Minimal helper: when given a CSS font-family string (e.g. `"Inter", sans-serif`),
 * attempt to load the Google Fonts CSS. If the family isn't a known Google font,
 * this is a no-op.
 */
export function useGoogleFont(fontFamily: string | undefined): void {
  React.useEffect(() => {
    if (!fontFamily) return
    if (typeof document === 'undefined') return

    const family = fontFamily.replace(/["']/g, '').split(',')[0]?.trim()
    if (!family) return

    // Best-effort heuristic: only load if it looks like a Google-font family name.
    if (!/^[a-zA-Z0-9 ]+$/.test(family)) return

    const id = `gf-${family.toLowerCase().replace(/\s+/g, '-')}`
    if (document.getElementById(id)) return

    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@300;400;500;600;700;800&display=swap`
    document.head.appendChild(link)
  }, [fontFamily])
}

