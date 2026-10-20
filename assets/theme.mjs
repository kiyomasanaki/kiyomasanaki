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

// dot texture fading in from the left, as on the hero (a mask, not an ink
// overlay, so the card keeps its translucency)
export function texture(w, h, rx = 14) {
  return `<defs><pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1" fill="${LINE}"/></pattern>
<linearGradient id="fadeg" x1="0" x2="1"><stop offset="0.35" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient>
<mask id="fade"><rect width="${w}" height="${h}" fill="url(#fadeg)"/></mask></defs>
<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="${rx}" fill="url(#dots)" mask="url(#fade)"/>`;
}

// translucent card + dot texture + neon spine on the left edge
export function card(w, h, { spine = CYAN, textured = true } = {}) {
  return `<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="14" fill="${INK}" fill-opacity="${ALPHA}" stroke="${LINE}"/>
${textured ? texture(w, h) + '\n' : ''}<rect x="0.5" y="18" width="3" height="${Math.max(12, h - 36)}" rx="1.5" fill="${spine}"/>`;
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

// ---- leaf cards ----------------------------------------------------------
// Rounded everywhere except one square corner, outlined in their accent. Across
// a group the square corner turns counter-clockwise from one element to the
// next (TL -> BL -> BR -> TR).
export const STROKE = 1;

// `sharp` = index of the square corner, in counter-clockwise order: 0 TL, 1 BL, 2 BR, 3 TR
export function leaf(x, y, w, h, { R = 20, sharp = 0 } = {}) {
  const [tl, bl, br, tr] = [0, 1, 2, 3].map((i) => (i === ((sharp % 4) + 4) % 4 ? 0 : R));
  return `M${x + tl} ${y}H${x + w - tr}Q${x + w} ${y} ${x + w} ${y + tr}V${y + h - br}Q${x + w} ${y + h} ${x + w - br} ${y + h}H${x + bl}Q${x} ${y + h} ${x} ${y + h - bl}V${y + tl}Q${x} ${y} ${x + tl} ${y}Z`;
}
