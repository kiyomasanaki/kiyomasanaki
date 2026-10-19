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

// solid card + neon spine on the left edge
export function card(w, h, { spine = CYAN } = {}) {
  return `<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="14" fill="${INK}" stroke="${LINE}"/>
<rect x="0.5" y="18" width="3" height="${Math.max(12, h - 36)}" rx="1.5" fill="${spine}"/>`;
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

// ---- outline style ("no background") -----------------------------------
// Transparent cards with an asymmetric "leaf" radius: big rounded corners on
// top-left / bottom-right, tight ones on the other diagonal. Rendered twice
// (dark + light) and swapped by a <picture> in the README, since there is
// no card behind the text to guarantee contrast.
export const THEMES = {
  dark:  { fg: IVORY,     muted: MUTED,     line: '#2a3756',
           acc: { [CYAN]: CYAN, [VIOLET]: VIOLET, [LIME]: LIME, [GOLD]: GOLD } },
  light: { fg: '#0b1020', muted: '#525d73', line: '#cdd5e3',
           acc: { [CYAN]: '#0a8f86', [VIOLET]: '#7445d6', [LIME]: '#16994a', [GOLD]: '#a87808' } },
};

export function leaf(x, y, w, h, { R = 20, r = 5 } = {}) {
  return `M${x + R} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - R}Q${x + w} ${y + h} ${x + w - R} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + R}Q${x} ${y} ${x + R} ${y}Z`;
}
