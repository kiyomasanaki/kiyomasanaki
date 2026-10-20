// Shared design tokens for the kiyomasanaki profile assets ("neon nebula").
// Every asset is a solid ink card, so it stays legible on ANY GitHub theme —
// light, dark, dimmed or high-contrast. No dependencies: stats.mjs imports this
// in CI without an npm install.

export const INK    = '#0b1020';   // card surface — deep space navy
export const INK2   = '#121a2e';   // raised surface (chips, bars)
export const LINE   = '#24304a';   // hairlines
export const IVORY  = '#e6edf7';   // primary text — starlight
export const MUTED  = '#8a96ad';   // secondary text
export const CYAN   = '#2ee6d6';   // neon cyan — primary accent
export const VIOLET = '#b07cff';   // plasma violet — secondary accent
export const LIME   = '#5dfc8d';   // thruster green — tertiary accent
export const GOLD   = '#f5c84b';   // hull gold — quaternary accent
export const BLUE   = '#4ea8ff';   // earth-glow blue

export const FONT  = "'JetBrains Mono','Fira Code','SFMono-Regular',ui-monospace,'Courier New',monospace";
export const CHARW = 0.6;
export const W     = 860;

export const ACCENTS = [CYAN, VIOLET, LIME, GOLD];
export const acc = (i) => ACCENTS[i % ACCENTS.length];
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const tw  = (s, fs) => Math.round(String(s).length * fs * CHARW);

// translucent ink: the page shows through a little, the text stays legible
export const ALPHA = 0.82;

// Background textures, all in the hairline colour and fading in from the left
// (a mask, not an ink overlay, so the card keeps its translucency). Cards cycle
// through them so neighbours never share the same one.
const TEX = {
  dots:    [16, 16, `<circle cx="1.5" cy="1.5" r="1" fill="${LINE}"/>`],
  grid:    [18, 18, `<path d="M18 0H0V18" fill="none" stroke="${LINE}" stroke-width="0.8"/>`],
  hatch:   [9, 9, `<path d="M-1 10L10 -1" stroke="${LINE}" stroke-width="0.9"/>`],
  plus:    [22, 22, `<path d="M11 7.5v7M7.5 11h7" stroke="${LINE}" stroke-width="1.2" stroke-linecap="round"/>`],
  circuit: [36, 36, `<path d="M0 9h12l6 6h18M9 36V27l6-6M27 0v6" fill="none" stroke="${LINE}" stroke-width="0.9"/><circle cx="12" cy="9" r="1.6" fill="${LINE}"/><circle cx="15" cy="21" r="1.6" fill="${LINE}"/><circle cx="27" cy="6" r="1.6" fill="${LINE}"/>`],
  waves:   [24, 12, `<path d="M0 6q6-6 12 0t12 0" fill="none" stroke="${LINE}" stroke-width="0.9"/>`],
  rings:   [26, 26, `<circle cx="13" cy="13" r="5.5" fill="none" stroke="${LINE}" stroke-width="0.9"/>`],
};
const ORDER = ['grid', 'hatch', 'circuit', 'plus', 'waves', 'rings', 'dots'];
let texN = 0, uid = 0;

export function texture(x, y, w, h, rx = 14, kind = ORDER[texN++ % ORDER.length]) {
  const [pw, ph, cell] = TEX[kind], k = uid++;
  return `<defs><pattern id="tx${k}" width="${pw}" height="${ph}" patternUnits="userSpaceOnUse">${cell}</pattern>
<linearGradient id="fg${k}" x1="0" x2="1"><stop offset="0.3" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient>
<mask id="fm${k}"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#fg${k})"/></mask></defs>
<rect x="${x + 1}" y="${y + 1}" width="${w - 2}" height="${h - 2}" rx="${rx}" fill="url(#tx${k})" mask="url(#fm${k})"/>`;
}

// translucent card + texture + neon spine on the left edge.
// tex: a texture name, undefined for the next one in the cycle, false for none
export function card(w, h, { spine = CYAN, tex, x = 0, y = 0, rx = 14 } = {}) {
  const sp = Math.min(18, h / 4);
  return `<rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${h - 1}" rx="${rx}" fill="${INK}" fill-opacity="${ALPHA}" stroke="${LINE}"/>
${tex === false ? '' : texture(x, y, w, h, rx, tex) + '\n'}<rect x="${x + 0.5}" y="${y + sp}" width="3" height="${h - 2 * sp}" rx="1.5" fill="${spine}"/>`;
}

// "// title" heading used inside cards
export function heading(x, y, title, color = CYAN) {
  return `<rect x="${x}" y="${y - 4}" width="8" height="8" rx="1.5" fill="${color}"/>
<text x="${x + 20}" y="${y}" font-family="${FONT}" font-size="14" font-weight="700" fill="${IVORY}" dominant-baseline="central" letter-spacing="0.5">${esc(title.toUpperCase())}</text>`;
}

export const svg = (w, h, label, body, defs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">
${defs ? `<defs>${defs}</defs>\n` : ''}${body}
</svg>
`;
