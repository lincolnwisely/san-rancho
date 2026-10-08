export function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

const DESCRIPTION_TAGS = new Set(["p", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li"]);

// Printify descriptions are HTML from its WYSIWYG editor. Keep only basic
// formatting tags, drop every attribute (e.g. inline styles), and escape any
// stray "<" so the result is safe to render with dangerouslySetInnerHTML.
export function sanitizeDescription(html: string): string {
  return html.replace(/<(\/?)([a-z0-9]+)\b[^>]*>|</gi, (match, slash, tag) => {
    if (match === "<") return "&lt;";
    const name = tag.toLowerCase();
    return DESCRIPTION_TAGS.has(name) ? `<${slash}${name}>` : "";
  });
}
