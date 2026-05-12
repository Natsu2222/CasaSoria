export function sanitizeSVG(svg: string): string {
  if (typeof svg !== 'string') return ''

  // Very small, defensive sanitizer for inline SVG usage.
  // Removes scripts/foreignObject and inline event handlers.
  let out = svg
    .replace(/<\s*script[\s\S]*?>[\s\S]*?<\s*\/\s*script\s*>/gi, '')
    .replace(/<\s*foreignObject[\s\S]*?>[\s\S]*?<\s*\/\s*foreignObject\s*>/gi, '')
    .replace(/\son\w+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, '')
    .replace(/\s(href|xlink:href)\s*=\s*("javascript:[^"]*"|'javascript:[^']*')/gi, '')

  // Only keep the first <svg>…</svg> if multiple exist
  const match = out.match(/<svg[\s\S]*?<\/svg>/i)
  if (match) out = match[0]!

  return out.trim()
}

