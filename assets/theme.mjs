// Shared design tokens for the kiyomasanaki profile assets ("core net").
// The look is lifted from the profile picture: a neon datacenter — holographic
// panels, fiber-optic cable runs and rack labels on near-black steel.
// Every asset is a dark hologram panel, so it stays legible on ANY GitHub theme —
// light, dark, dimmed or high-contrast. No dependencies: stats.mjs imports this
// in CI without an npm install.

export const INK     = '#070c14';   // panel surface — unlit server hall
export const INK2    = '#0e1826';   // raised surface (chips, bars)
export const LINE    = '#1d3344';   // hairlines — cold steel
export const IVORY   = '#e4f6f8';   // primary text — hologram white
export const MUTED   = '#7f97a8';   // secondary text
export const CYAN    = '#35e3ea';   // hologram cyan — primary accent
export const MAGENTA = '#ff4fcf';   // core-net magenta — secondary accent
export const LIME    = '#6dff8a';   // status-LED green — tertiary accent
export const AMBER   = '#ff9a3c';   // fiber orange — quaternary accent
export const BLUE    = '#4d9dff';   // fiber blue

export const FONT  = "'JetBrains Mono','Fira Code','SFMono-Regular',ui-monospace,'Courier New',monospace";
export const CHARW = 0.6;
export const W     = 860;

export const ACCENTS = [CYAN, MAGENTA, LIME, AMBER];
export const acc = (i) => ACCENTS[i % ACCENTS.length];
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const tw  = (s, fs) => Math.round(String(s).length * fs * CHARW);

// translucent ink: the page shows through a little, the text stays legible
export const ALPHA = 0.93;

// Background textures, all in the hairline colour and fading in from the left
// (a mask, not an ink overlay, so the card keeps its translucency). Cards cycle
// through them so neighbours never share the same one.
const TEX = {
  scan:    [6, 4, `<path d="M0 1.5H6" stroke="${LINE}" stroke-width="0.8"/>`],
  grid:    [18, 18, `<path d="M18 0H0V18" fill="none" stroke="${LINE}" stroke-width="0.8"/>`],
  rack:    [44, 14, `<rect x="2" y="3" width="40" height="8" rx="1.5" fill="none" stroke="${LINE}" stroke-width="0.8"/><circle cx="8" cy="7" r="1.2" fill="${LINE}"/><circle cx="13" cy="7" r="1.2" fill="${LINE}"/><path d="M22 7h16" stroke="${LINE}" stroke-width="0.8"/>`],
  circuit: [36, 36, `<path d="M0 9h12l6 6h18M9 36V27l6-6M27 0v6" fill="none" stroke="${LINE}" stroke-width="0.9"/><circle cx="12" cy="9" r="1.6" fill="${LINE}"/><circle cx="15" cy="21" r="1.6" fill="${LINE}"/><circle cx="27" cy="6" r="1.6" fill="${LINE}"/>`],
  plus:    [22, 22, `<path d="M11 7.5v7M7.5 11h7" stroke="${LINE}" stroke-width="1.2" stroke-linecap="round"/>`],
  dots:    [16, 16, `<circle cx="1.5" cy="1.5" r="1" fill="${LINE}"/>`],
};
const ORDER = ['scan', 'rack', 'grid', 'circuit', 'plus', 'dots'];
let texN = 0, uid = 0;

export function texture(x, y, w, h, rx = 6, kind = ORDER[texN++ % ORDER.length]) {
  const [pw, ph, cell] = TEX[kind], k = uid++;
  return `<defs><pattern id="tx${k}" width="${pw}" height="${ph}" patternUnits="userSpaceOnUse">${cell}</pattern>
<linearGradient id="fg${k}" x1="0" x2="1"><stop offset="0.3" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient>
<mask id="fm${k}"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#fg${k})"/></mask></defs>
<rect x="${x + 1}" y="${y + 1}" width="${w - 2}" height="${h - 2}" rx="${rx}" fill="url(#tx${k})" mask="url(#fm${k})"/>`;
}

// Hologram panel: translucent ink, a faint wash + border in the panel's own
// colour, a texture, and HUD brackets on the four corners.
// tex: a texture name, undefined for the next one in the cycle, false for none
export const RX = 6;
export function card(w, h, { spine = CYAN, tex, x = 0, y = 0 } = {}) {
  const b = Math.min(14, h / 4), r = RX;
  const l = x + 0.75, t = y + 0.75, rt = x + w - 0.75, bt = y + h - 0.75;
  const corners = `M${l} ${t + b}V${t + r}a${r} ${r} 0 0 1 ${r}-${r}H${l + b}M${rt - b} ${t}H${rt - r}a${r} ${r} 0 0 1 ${r} ${r}V${t + b}M${rt} ${bt - b}V${bt - r}a${r} ${r} 0 0 1-${r} ${r}H${rt - b}M${l + b} ${bt}H${l + r}a${r} ${r} 0 0 1-${r}-${r}V${bt - b}`;
  return `<rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${h - 1}" rx="${r}" fill="${INK}" fill-opacity="${ALPHA}"/>
<rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${h - 1}" rx="${r}" fill="${spine}" fill-opacity="0.045" stroke="${spine}" stroke-opacity="0.3"/>
${tex === false ? '' : texture(x, y, w, h, r, tex) + '\n'}<path d="${corners}" fill="none" stroke="${spine}" stroke-width="1.5" stroke-linecap="round"/>`;
}

// Fiber-optic cable run from x1 to x2 around the line y: wavy, crossing cables
// in the fiber colours, each with a soft halo and a light pulse travelling
// along it. fade: cables fade in from the left; land: y they converge on at x2.
export const FIBER_CSS = '.fp{stroke-dasharray:5 95;animation:fp 5s linear infinite}@keyframes fp{from{stroke-dashoffset:100}to{stroke-dashoffset:0}}@media (prefers-reduced-motion:reduce){.fp,.cur,.spin{animation:none}}';
const FIBERS = [CYAN, MAGENTA, AMBER, LIME, BLUE];
export function fibers(x1, x2, y, { n = 5, spread = 18, amp = 7, seg = 80, seed = 7, width = 1.6, fade = false, land } = {}) {
  let s = seed;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const k = uid++, steps = Math.max(2, Math.round((x2 - x1) / seg)), dx = (x2 - x1) / steps;
  const grad = (id, c) => `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${x1}" x2="${x2}" y1="0" y2="0"><stop offset="0" stop-color="${c}" stop-opacity="0"/><stop offset="0.45" stop-color="${c}"/></linearGradient>`;
  let defs = fade ? grad(`fb${k}_p`, IVORY) : '', g = '';
  for (let j = 0; j < n; j++) {
    const c = FIBERS[j % FIBERS.length], o = n > 1 ? j / (n - 1) - 0.5 : 0, ph = rnd() * 6.28, f = 0.7 + rnd() * 0.9;
    const pts = Array.from({ length: steps + 1 }, (_, i) => [x1 + i * dx, y + o * spread + amp * Math.sin(ph + i * f)]);
    if (land !== undefined) pts[steps][1] = land + o * Math.min(spread, 16);
    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 1; i <= steps; i++) d += `C${(pts[i - 1][0] + dx / 2).toFixed(1)} ${pts[i - 1][1].toFixed(1)} ${(pts[i][0] - dx / 2).toFixed(1)} ${pts[i][1].toFixed(1)} ${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}`;
    let stroke = c;
    if (fade) {
      defs += grad(`fb${k}_${j}`, c);
      stroke = `url(#fb${k}_${j})`;
    }
    g += `<path d="${d}" stroke="${stroke}" stroke-width="${width * 3.6}" stroke-opacity="0.16"/><path d="${d}" stroke="${stroke}" stroke-width="${width}" stroke-opacity="0.9"/>`
      + `<path class="fp" d="${d}" pathLength="100" stroke="${fade ? `url(#fb${k}_p)` : IVORY}" stroke-width="${width}" style="animation-duration:${(4 + rnd() * 4).toFixed(1)}s;animation-delay:-${(rnd() * 8).toFixed(1)}s"/>\n`;
  }
  return `${defs ? `<defs>${defs}</defs>` : ''}<g fill="none" stroke-linecap="round">\n${g}</g>`;
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
