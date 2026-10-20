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

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
  "&ldquo;": "“",
  "&rdquo;": "”",
  "&lsquo;": "‘",
  "&rsquo;": "’",
  "&lt;": "<",
  "&gt;": ">",
  "&apos;": "'",
  "&ndash;": "–",
  "&mdash;": "—",
  "&hellip;": "…",
  "&reg;": "®",
  "&trade;": "™",
  "&copy;": "©",
  "&deg;": "°",
  "&sup2;": "²",
  "&sup3;": "³",
  "&frac12;": "½",
  "&times;": "×",
};

// Named entities from the table above, plus any numeric one ("&#8217;", "&#x2019;").
function decodeEntity(entity: string): string {
  const numeric = /^&#(x?)([0-9a-f]+);$/i.exec(entity);
  if (numeric) {
    const code = parseInt(numeric[2], numeric[1] ? 16 : 10);
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : entity;
  }
  return ENTITIES[entity.toLowerCase()] ?? entity;
}

export function toPlainText(html: string, max = 160): string {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, decodeEntity)
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}
