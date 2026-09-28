// Shared design tokens for the kiyomasanaki profile assets ("sumi & vermilion").
// Every asset is a solid ink card, so it stays legible on ANY GitHub theme —
// light, dark, dimmed or high-contrast. No dependencies: stats.mjs imports this
// in CI without an npm install.

export const INK    = '#101318';   // card surface
export const INK2   = '#171b22';   // raised surface (chips, bars)
export const LINE   = '#262c36';   // hairlines
export const IVORY  = '#ece6da';   // primary text
export const MUTED  = '#8c9099';   // secondary text
export const VERM   = '#ff5b3a';   // vermilion — primary accent
export const GOLD   = '#e9b949';   // gold — secondary accent
export const JADE   = '#5cc8a8';   // rare tertiary accent

export const FONT  = "'JetBrains Mono','Fira Code','SFMono-Regular',ui-monospace,'Courier New',monospace";
export const CHARW = 0.6;
export const W     = 860;

export const acc = (i) => (i % 2 === 0 ? VERM : GOLD);
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const tw  = (s, fs) => Math.round(String(s).length * fs * CHARW);

// solid card + vermilion spine on the left edge
export function card(w, h, { spine = VERM } = {}) {
  return `<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="14" fill="${INK}" stroke="${LINE}"/>
<rect x="0.5" y="18" width="3" height="${Math.max(12, h - 36)}" rx="1.5" fill="${spine}"/>`;
}

// "// title" heading used inside cards
export function heading(x, y, title, color = VERM) {
  return `<rect x="${x}" y="${y - 4}" width="8" height="8" rx="1.5" fill="${color}"/>
<text x="${x + 20}" y="${y}" font-family="${FONT}" font-size="14" font-weight="700" fill="${IVORY}" dominant-baseline="central" letter-spacing="0.5">${esc(title.toUpperCase())}</text>`;
}

export const svg = (w, h, label, body, defs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">
${defs ? `<defs>${defs}</defs>\n` : ''}${body}
</svg>
`;
