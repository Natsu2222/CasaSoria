export function expandFontGroupRichTextFields<T extends Record<string, unknown>>(value: T): T {
  // Compatibility shim: in this codebase we don't transform the relationship shape.
  return value
}

