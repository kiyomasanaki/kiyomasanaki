// SVG asset generator for the kiyomasanaki GitHub profile ("neon nebula").
// Solid ink cards with a neon spine — readable on every GitHub theme.
// Run:  node assets/generate.mjs   (requires: npm i simple-icons)
import * as si from 'simple-icons';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { INK, INK2, LINE, IVORY, MUTED, CYAN, VIOLET, LIME, GOLD, BLUE, FONT, W, acc, esc, tw, card, heading, svg, THEMES, STROKE, leaf } from './theme.mjs';

const OUT = dirname(fileURLToPath(import.meta.url));
const out = (file, content) => writeFileSync(join(OUT, file), content);

const USER = 'kiyomasanaki';
const PAD = 28;

// fallback glyph (hexagon target) for brands missing from simple-icons
const FALLBACK = 'M12 1.6l9 5.2v10.4l-9 5.2-9-5.2V6.8zM12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 2.4a2.1 2.1 0 110 4.2 2.1 2.1 0 010-4.2z';
// logos missing from simple-icons, kept as the vendor's official SVG in icons/
// (ids are prefixed so several inline logos can't collide)
const CUSTOM_ICONS = Object.fromEntries(['caido'].map((slug) => {
  const raw = readFileSync(join(OUT, 'icons', `${slug}.svg`), 'utf8');
  return [slug, {
    viewBox: raw.match(/viewBox="([^"]+)"/)[1],
    body: raw.replace(/^[\s\S]*?<svg[^>]*>|<\/svg>\s*$/g, '').replace(/xlink:href=/g, 'href=').replace(/(id="|url\(#|href="#)/g, `$1${slug}-`),
  }];
}));
const iconPath = (slug) => si['si' + slug.charAt(0).toUpperCase() + slug.slice(1)]?.path ?? FALLBACK;
// brand colour of a logo, lightened just enough to stay readable on the ink chips
const lum = (hex) => {
  const c = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const mix = (hex, t) => [0, 2, 4].map((i) => {
  const v = parseInt(hex.slice(i, i + 2), 16);
  return Math.round(v + (255 - v) * t).toString(16).padStart(2, '0');
}).join('');
// logos whose simple-icons colour is missing or isn't the colour people know them by
const BRAND_OVERRIDE = { ethereum: '627EEA', ghidra: 'E0201F', caido: 'A1223F' };
function brandColor(slug) {
  const base = BRAND_OVERRIDE[slug] ?? si['si' + slug.charAt(0).toUpperCase() + slug.slice(1)]?.hex ?? IVORY.slice(1);
  const bg = lum(INK2.slice(1));
  let hex = base, t = 0;
  while ((lum(hex) + 0.05) / (bg + 0.05) < 3.5 && t < 1) hex = mix(base, (t += 0.05));
  return '#' + hex.toLowerCase();
}

function icon(slug, x, y, size, color) {
  const custom = CUSTOM_ICONS[slug];
  if (custom) return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="${custom.viewBox}">${custom.body}</svg>`;
  return `<g transform="translate(${x},${y}) scale(${(size / 24).toFixed(4)})"><path d="${iconPath(slug)}" fill="${color}"/></g>`;
}

// ---- hero --------------------------------------------------------------
function hero() {
  const H = 230;
  const name = USER;
  const nfs = 50, nw = tw(name, nfs);
  const sx = W - 150, sy = 52, ss = 110;
  const dots = `<pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1" fill="${LINE}"/></pattern>
<linearGradient id="fade" x1="0" x2="1"><stop offset="0.35" stop-color="${INK}"/><stop offset="1" stop-color="${INK}" stop-opacity="0"/></linearGradient>
<radialGradient id="neb1" cx="0.82" cy="0.2" r="0.45"><stop offset="0" stop-color="${VIOLET}" stop-opacity="0.28"/><stop offset="1" stop-color="${VIOLET}" stop-opacity="0"/></radialGradient>
<radialGradient id="neb2" cx="0.62" cy="1" r="0.5"><stop offset="0" stop-color="${CYAN}" stop-opacity="0.18"/><stop offset="1" stop-color="${CYAN}" stop-opacity="0"/></radialGradient>
<linearGradient id="tag" x1="0" x2="1"><stop offset="0" stop-color="${CYAN}"/><stop offset="0.5" stop-color="${LIME}"/><stop offset="1" stop-color="${GOLD}"/></linearGradient>
<linearGradient id="seal" gradientUnits="userSpaceOnUse" x1="${sx}" y1="${sy}" x2="${sx + ss}" y2="${sy + ss}"><stop offset="0" stop-color="${BLUE}"/><stop offset="0.5" stop-color="${VIOLET}"/><stop offset="1" stop-color="${GOLD}"/></linearGradient>
<filter id="inked" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="0.9" result="d"/><feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves="2" seed="3" result="m"/><feColorMatrix in="m" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.6" result="mask"/><feComposite in="d" in2="mask" operator="in"/></filter>
<style>.cur{animation:b 1.1s steps(1) infinite}@keyframes b{50%{opacity:0}}</style>`;
  const tags = ['PHP', 'Web3', 'AI', 'Offensive Security'];
  let tx = PAD + 8, chips = '';
  tags.forEach((t, i) => {
    const w = tw(t, 12.5) + 24;
    chips += `<rect x="${tx}" y="170" width="${w}" height="28" rx="7" fill="${INK2}" stroke="${LINE}"/>
<text x="${tx + 12}" y="184" font-family="${FONT}" font-size="12.5" font-weight="600" fill="${acc(i)}" dominant-baseline="central" textLength="${tw(t, 12.5)}">${esc(t)}</text>`;
    tx += w + 10;
  });
  // hanko-style stamp
  // rubber stamp: serrated ring, MADE IN / FRANCE on arcs, the Hexagone in the middle
  const cx = sx + ss / 2, cy = sy + ss / 2, teeth = 44;
  const ring = Array.from({ length: teeth * 2 }, (_, i) => {
    const r = i % 2 ? 51 : 55, a = (Math.PI * i) / teeth;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
  const hexagone = [[.38, 0], [.62, .12], [.92, .22], [.86, .52], [.95, .78], [.66, .95], [.42, .92], [.22, 1], [.12, .72], [.02, .42], [0, .3], [.18, .2]]
    .map(([x, y]) => `${(cx - 15 + x * 30).toFixed(1)},${(cy - 15 + y * 30).toFixed(1)}`).join(' ');
  const star = (x) => `<text x="${x}" y="${cy}" font-family="${FONT}" font-size="9" fill="url(#seal)" text-anchor="middle" dominant-baseline="central">★</text>`;
  const stamp = `<g transform="rotate(-8 ${cx} ${cy})" filter="url(#inked)">
<polygon points="${ring}" fill="none" stroke="url(#seal)" stroke-width="2.2" stroke-linejoin="round"/>
<circle cx="${cx}" cy="${cy}" r="45" fill="url(#seal)" fill-opacity="0.08" stroke="url(#seal)" stroke-width="1.6"/>
<circle cx="${cx}" cy="${cy}" r="25" fill="none" stroke="url(#seal)" stroke-width="1"/>
<path id="arcTop" d="M${cx - 34} ${cy} A34 34 0 0 1 ${cx + 34} ${cy}" fill="none"/>
<path id="arcBot" d="M${cx - 40} ${cy} A40 40 0 0 0 ${cx + 40} ${cy}" fill="none"/>
<text font-family="${FONT}" font-size="12.5" font-weight="800" fill="url(#seal)" letter-spacing="2.5"><textPath href="#arcTop" startOffset="50%" text-anchor="middle">MADE IN</textPath></text>
<text font-family="${FONT}" font-size="12.5" font-weight="800" fill="url(#seal)" letter-spacing="2.5"><textPath href="#arcBot" startOffset="50%" text-anchor="middle">FRANCE</textPath></text>
${star(cx - 35)}${star(cx + 35)}
<polygon points="${hexagone}" fill="url(#seal)" fill-opacity="0.85" stroke="url(#seal)" stroke-width="1" stroke-linejoin="round"/>
</g>`;
  const body = `${card(W, H)}
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="14" fill="url(#dots)"/>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="14" fill="url(#fade)"/>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="14" fill="url(#neb1)"/>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="14" fill="url(#neb2)"/>
<text x="${PAD + 8}" y="44" font-family="${FONT}" font-size="13" fill="${MUTED}" dominant-baseline="central" xml:space="preserve"><tspan fill="${CYAN}" font-weight="700">~/</tspan>${USER}  <tspan fill="${LINE}">│</tspan>  full-stack dev  <tspan fill="${LINE}">│</tspan>  ethical hacker</text>
<text x="${PAD + 4}" y="96" font-family="${FONT}" font-size="${nfs}" font-weight="800" fill="${IVORY}" dominant-baseline="central" textLength="${nw}" lengthAdjust="spacingAndGlyphs">${name}</text>
<rect class="cur" x="${PAD + 12 + nw}" y="74" width="24" height="46" fill="${CYAN}"/>
<text x="${PAD + 8}" y="140" font-family="${FONT}" font-size="15" fill="${IVORY}" dominant-baseline="central" xml:space="preserve">Breaking stuff <tspan fill="url(#tag)" font-weight="700">to make it stronger.</tspan></text>
${chips}
${stamp}`;
  out('hero.svg', svg(W, H, `${USER} — full-stack developer & ethical hacker`, body, dots));
}

// ---- section header ----------------------------------------------------
function header(name, n, title, command) {
  const H = 56;
  const num = String(n).padStart(2, '0');
  const cmd = `$ ${command}`;
  const cw = tw(cmd, 12.5);
  const body = `<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="12" fill="${INK}" stroke="${LINE}"/>
<text x="${PAD}" y="${H / 2}" font-family="${FONT}" font-size="15" font-weight="800" fill="${CYAN}" dominant-baseline="central">${num}</text>
<rect x="${PAD + 30}" y="${H / 2 - 9}" width="1.5" height="18" fill="${LINE}"/>
<text x="${PAD + 46}" y="${H / 2}" font-family="${FONT}" font-size="17" font-weight="800" fill="${IVORY}" dominant-baseline="central" letter-spacing="1">${esc(title.toUpperCase())}</text>
<rect x="${W - PAD - cw - 20}" y="${H / 2 - 14}" width="${cw + 20}" height="28" rx="7" fill="${INK2}" stroke="${LINE}"/>
<text x="${W - PAD - cw - 10}" y="${H / 2}" font-family="${FONT}" font-size="12.5" fill="${MUTED}" dominant-baseline="central" textLength="${cw}" xml:space="preserve">${esc(cmd)}</text>`;
  out(`header-${name}.svg`, svg(W, H, `${num} ${title} — ${command}`, body));
}

// ---- skill card (chips) ------------------------------------------------
const C_H = 40, C_ICON = 18, C_PADL = 14, C_GAP = 10, C_PADR = 16, C_FS = 14;
const chipW = (l) => C_PADL + C_ICON + C_GAP + tw(l, C_FS) + C_PADR;
function chip(x, y, label, slug, color, outlined = false) {
  const frame = outlined
    ? `<rect x="${x}" y="${y}" width="${chipW(label)}" height="${C_H}" rx="9" fill="${INK2}" stroke="${color}" stroke-opacity="0.85"/>`
    : `<rect x="${x}" y="${y}" width="${chipW(label)}" height="${C_H}" rx="9" fill="${INK2}" stroke="${LINE}"/>
<rect x="${x}" y="${y + C_H - 2.5}" width="${chipW(label)}" height="2.5" rx="1.2" fill="${color}" fill-opacity="0.75"/>`;
  return `${frame}
${icon(slug, x + C_PADL, y + (C_H - C_ICON) / 2, C_ICON, color)}
<text x="${x + C_PADL + C_ICON + C_GAP}" y="${y + C_H / 2}" font-family="${FONT}" font-size="${C_FS}" font-weight="500" fill="${IVORY}" dominant-baseline="central" textLength="${tw(label, C_FS)}" lengthAdjust="spacingAndGlyphs">${esc(label)}</text>`;
}
// brand: chips take the logo's own colour (icon + outline) instead of the palette
function skillCard(name, title, items, color = CYAN, { brand = true } = {}) {
  const inner = W - PAD * 2, gap = 10;
  const rows = [[]]; let rw = 0;
  const off = Math.max(0, [CYAN, VIOLET, LIME, GOLD].indexOf(color));
  for (const it of items) {
    const w = chipW(it.label);
    if (rw + w > inner && rows.at(-1).length) { rows.push([]); rw = 0; }
    rows.at(-1).push({ ...it, w }); rw += w + gap;
  }
  const top = 54, H = top + rows.length * (C_H + gap) - gap + 24;
  let chips = '', y = top, i = 0;
  for (const row of rows) {
    let x = PAD;
    for (const it of row) { chips += brand ? chip(x, y, it.label, it.slug, brandColor(it.slug), true) : chip(x, y, it.label, it.slug, acc(off + i++)); x += it.w + gap; }
    y += C_H + gap;
  }
  const count = `${String(items.length).padStart(2, '0')} items`;
  const body = `${card(W, H, { spine: color })}
${heading(PAD, 28, title, color)}
<text x="${W - PAD}" y="28" font-family="${FONT}" font-size="12" fill="${MUTED}" text-anchor="end" dominant-baseline="central">${count}</text>
${chips}`;
  out(`stack-${name}.svg`, svg(W, H, title, body));
}

// ---- text panel --------------------------------------------------------
function panel(name, { title, label, lines, color = CYAN, lh = 30 }) {
  const top = title ? 58 : 26;
  const H = top + lines.length * lh + 22;
  let body = title ? heading(PAD, 30, title, color) : '';
  lines.forEach((ln, i) => {
    const y = top + i * lh + lh / 2;
    let x = PAD;
    if (ln.n !== undefined) {
      body += `<text x="${x}" y="${y}" font-family="${FONT}" font-size="12.5" font-weight="700" fill="${ln.c || CYAN}" dominant-baseline="central">${String(ln.n).padStart(2, '0')}</text>`;
      x += 34;
    } else if (ln.tag) {
      const w = tw(ln.tag, 11.5) + 16;
      body += `<rect x="${x}" y="${y - 11}" width="${w}" height="22" rx="5" fill="${ln.c || CYAN}" fill-opacity="0.14" stroke="${ln.c || CYAN}" stroke-opacity="0.45"/>
<text x="${x + w / 2}" y="${y}" font-family="${FONT}" font-size="11.5" font-weight="700" fill="${ln.c || CYAN}" text-anchor="middle" dominant-baseline="central">${esc(ln.tag)}</text>`;
      x += w + 16;
    }
    const segs = Array.isArray(ln.text) ? ln.text : [{ t: ln.text, c: ln.tc }];
    const spans = segs.map((s) => `<tspan fill="${s.c || IVORY}" font-weight="${s.b ? 700 : 400}">${esc(s.t)}</tspan>`).join('');
    body += `<text x="${x}" y="${y}" font-family="${FONT}" font-size="14" dominant-baseline="central" xml:space="preserve">${spans}</text>`;
  });
  out(`${name}.svg`, svg(W, H, label || title || name, `${card(W, H, { spine: color })}\n${body}`));
}

// ---- button ------------------------------------------------------------
function button(name, label, slug, color, filled) {
  const H = 48, FS = 14.5, ic = 18, padL = 20, gap = 10, padR = 22;
  const w = padL + ic + gap + tw(label, FS) + padR;
  const fg = filled ? INK : IVORY;
  const body = `<rect x="0.5" y="0.5" width="${w - 1}" height="${H - 1}" rx="10" fill="${filled ? color : INK}" stroke="${filled ? color : LINE}"/>
${icon(slug, padL, (H - ic) / 2, ic, filled ? INK : color)}
<text x="${padL + ic + gap}" y="${H / 2}" font-family="${FONT}" font-size="${FS}" font-weight="700" fill="${fg}" dominant-baseline="central" textLength="${tw(label, FS)}" lengthAdjust="spacingAndGlyphs">${esc(label)}</text>`;
  out(`btn-${name}.svg`, svg(w, H, label, body));
}

// ---- outline components (no background, light + dark) ------------------
function outline(name, label, w, h, draw) {
  for (const [mode, t] of Object.entries(THEMES)) out(`${name}-${mode}.svg`, svg(w, h, label, draw(t)));
}
const wrap = (text, max) => text.split(' ').reduce((ls, word) => {
  const last = ls.at(-1);
  if (last && (last + ' ' + word).length <= max) ls[ls.length - 1] = last + ' ' + word; else ls.push(word);
  return ls;
}, []);

// tagline: one outlined pill per word, chevrons in between, full width
function tagline(words) {
  const H = 52, gap = 40, pw = (W - 2 - gap * (words.length - 1)) / words.length;
  outline('tagline', words.join(' → '), W, H, (t) => words.map((wd, i) => {
    const x = 1 + i * (pw + gap), c = t.acc[acc(i)], last = i === words.length - 1;
    let g = `<path d="${leaf(x, 1, pw, H - 2, { R: 16, sharp: i })}" fill="none" stroke="${c}" stroke-width="${STROKE}"/>
<text x="${x + pw / 2}" y="${H / 2}" font-family="${FONT}" font-size="14" font-weight="700" fill="${last ? c : t.fg}" text-anchor="middle" dominant-baseline="central" letter-spacing="2">${esc(wd.toUpperCase())}</text>`;
    if (!last) g += `\n<path d="M${x + pw + gap / 2 - 4} ${H / 2 - 6}l7 6-7 6" fill="none" stroke="${t.muted}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
    return g;
  }).join('\n'));
}

// contact links: four outlined cards, laid side by side in the README
function linkCard(name, { cap, value, slug, color, sharp }) {
  const w = 206, h = 72;
  outline(`link-${name}`, `${cap}: ${value}`, w, h, (t) => {
    const c = t.acc[color];
    return `<path d="${leaf(1, 1, w - 2, h - 2, { sharp })}" fill="none" stroke="${c}" stroke-width="${STROKE}"/>
${icon(slug, 18, h / 2 - 11, 22, c)}
<text x="54" y="25" font-family="${FONT}" font-size="10.5" font-weight="700" fill="${c}" dominant-baseline="central" letter-spacing="2">${esc(cap.toUpperCase())}</text>
<text x="54" y="47" font-family="${FONT}" font-size="12.5" font-weight="600" fill="${t.fg}" dominant-baseline="central" textLength="${Math.min(tw(value, 12.5), w - 70)}" lengthAdjust="spacingAndGlyphs">${esc(value)}</text>`;
  });
}

// featured project card
function projectCard(name, { title, slug, color, desc, tags, meta, sharp }) {
  const w = 424, h = 196, P = 24;
  outline(`project-${name}`, `${title} — ${desc}`, w, h, (t) => {
    const c = t.acc[color];
    let g = `<path d="${leaf(1, 1, w - 2, h - 2, { R: 26, sharp })}" fill="none" stroke="${c}" stroke-width="${STROKE}"/>
${icon(slug, P, 24, 22, c)}
<text x="${P + 34}" y="35" font-family="${FONT}" font-size="18" font-weight="800" fill="${t.fg}" dominant-baseline="central">${esc(title)}</text>`;
    if (meta) {
      const mw = tw(meta, 11) + 22;
      g += `\n<path d="${leaf(w - P - mw, 22, mw, 26, { R: 10, sharp })}" fill="none" stroke="${c}" stroke-opacity="0.7" stroke-width="${STROKE}"/>
<text x="${w - P - mw / 2}" y="35" font-family="${FONT}" font-size="11" font-weight="700" fill="${c}" text-anchor="middle" dominant-baseline="central">${esc(meta)}</text>`;
    }
    wrap(desc, 48).slice(0, 3).forEach((ln, i) => {
      g += `\n<text x="${P}" y="${78 + i * 22}" font-family="${FONT}" font-size="13" fill="${t.muted}" dominant-baseline="central">${esc(ln)}</text>`;
    });
    let x = P;
    tags.forEach((tag, i) => {
      const tc = t.acc[acc(i)];
      g += `\n<circle cx="${x + 4}" cy="${h - 30}" r="3.5" fill="${tc}"/>
<text x="${x + 14}" y="${h - 30}" font-family="${FONT}" font-size="12" font-weight="600" fill="${t.fg}" dominant-baseline="central">${esc(tag)}</text>`;
      x += 14 + tw(tag, 12) + 22;
    });
    return g;
  });
}

// pgp key summary
function pgpCard(lines) {
  const h = 40 + lines.length * 28;
  outline('pgp', 'PGP key', W, h, (t) => {
    let g = `<path d="${leaf(1, 1, W - 2, h - 2, { R: 26 })}" fill="none" stroke="${t.acc[GOLD]}" stroke-width="${STROKE}"/>`;
    lines.forEach(([k, v], i) => {
      const y = 34 + i * 28, c = t.acc[acc(i)];
      g += `\n<text x="32" y="${y}" font-family="${FONT}" font-size="14" font-weight="800" fill="${c}" dominant-baseline="central">${esc(k)}</text>
<text x="96" y="${y}" font-family="${FONT}" font-size="14" fill="${t.fg}" dominant-baseline="central" xml:space="preserve">${esc(v)}</text>`;
    });
    return g;
  });
}

// ========================================================================
// content
// ========================================================================
hero();

header('whoami',   1, 'whoami',       'whoami --verbose');
header('stack',    2, 'stack',        'cat stack.conf');
header('projects', 3, 'projects',     'ls ~/projects/featured');
header('hacking',  4, 'offsec',       'nmap -sV ./ethical-hacking');
header('focus',    5, 'focus',        'tail -f focus.log');
header('stats',    6, 'stats',        'git log --stat --all');
header('gpg',      7, 'pgp key',      'gpg --list-keys');

skillCard('languages', 'languages', [
  { label: 'PHP', slug: 'php' }, { label: 'JavaScript', slug: 'javascript' },
  { label: 'Python', slug: 'python' }, { label: 'Solidity', slug: 'solidity' },
  { label: 'Bash', slug: 'gnubash' },
]);
skillCard('frameworks', 'frameworks & runtimes', [
  { label: 'Laravel', slug: 'laravel' }, { label: 'Symfony', slug: 'symfony' },
  { label: 'Node.js', slug: 'nodedotjs' }, { label: 'React', slug: 'react' },
  { label: 'Vue.js', slug: 'vuedotjs' }, { label: 'TensorFlow.js', slug: 'tensorflow' },
], VIOLET);
skillCard('chain', 'chain · cloud · ops', [
  { label: 'Ethereum', slug: 'ethereum' }, { label: 'BNB Chain', slug: 'binance' },
  { label: 'Web3.js', slug: 'web3dotjs' }, { label: 'Docker', slug: 'docker' },
  { label: 'Linux', slug: 'linux' }, { label: 'Kali', slug: 'kalilinux' },
], LIME);
skillCard('offsec', 'offsec toolkit', [
  { label: 'Caido', slug: 'caido' }, { label: 'Burp Suite', slug: 'burpsuite' }, { label: 'Wireshark', slug: 'wireshark' },
  { label: 'Nmap', slug: 'nmap' }, { label: 'Metasploit', slug: 'metasploit' },
  { label: 'Ghidra', slug: 'ghidra' },
], GOLD);
skillCard('platforms', 'platforms — challenges & training', [
  { label: 'Hack The Box', slug: 'hackthebox' }, { label: 'TryHackMe', slug: 'tryhackme' },
  { label: 'Root-Me', slug: 'rootme' },
]);
skillCard('bugbounty', 'bug bounty programs', [
  { label: 'HackerOne', slug: 'hackerone' }, { label: 'YesWeHack', slug: 'yeswehack' },
  { label: 'Intigriti', slug: 'intigriti' },
], VIOLET);

tagline(['build', 'break', 'learn', 'share', 'repeat']);

linkCard('website',  { sharp: 0, cap: 'website',  value: 'wespify.com',         slug: 'googlechrome',    color: CYAN });
linkCard('contact',  { sharp: 1, cap: 'contact',  value: 'github@wespify.com',  slug: 'protonmail',      color: VIOLET });
linkCard('location', { sharp: 2, cap: 'location', value: 'Made in France',      slug: 'openstreetmap',   color: LIME });
linkCard('pgp',      { sharp: 3, cap: 'pgp',      value: 'A0B6 3B54 A0D3 3C06', slug: 'gnuprivacyguard', color: GOLD });

// featured = the repos with the most commits authored by me (abandoned ones excluded)
projectCard('bigdump', { sharp: 0,
  title: 'bigdump', slug: 'mysql', color: CYAN, meta: '161 commits',
  desc: 'Staggered MySQL dump importer for servers with strict time limits — single-file PHAR, live SSE progress, CLI optimizer.',
  tags: ['PHP 8.1+', 'MySQL', 'PHAR'],
});
projectCard('codepack', { sharp: 1,
  title: 'codepack', slug: 'gnubash', color: VIOLET, meta: '69 commits',
  desc: 'Ultra-efficient CLI that extracts folder structure and file contents, minified and ready for AI processing.',
  tags: ['Bash', 'CLI', 'AI-ready'],
});
projectCard('commeaucinema', { sharp: 2,
  title: 'commeaucinema', slug: 'rss', color: LIME, meta: '19 commits',
  desc: 'PHP package exposing the commeaucinema.com feeds — weekly releases, films in theaters and cinema news.',
  tags: ['PHP', 'Composer', 'RSS'],
});
projectCard('next', { sharp: 3,
  title: "what's next?", slug: 'maildotru', color: GOLD,
  desc: "Got an idea, a need, a technical challenge? Let's talk — github@wespify.com",
  tags: ['collab', 'freelance', 'open source'],
});

pgpCard([
  ['pub', 'rsa4096 2025-11-14 [SC]'],
  ['uid', 'w3spi5 <github@wespify.com>'],
  ['sub', 'rsa4096 2025-11-14 [E]'],
]);

panel('whoami', {
  title: 'about', label: 'About me', lh: 30,
  lines: [
    { text: [{ t: 'Full-stack developer', c: CYAN, b: true }, { t: ' based in ' }, { t: 'France', c: GOLD, b: true }, { t: ' — building robust apps at the' }] },
    { text: [{ t: 'intersection of ' }, { t: 'Web', c: CYAN, b: true }, { t: ', ' }, { t: 'Blockchain', c: VIOLET, b: true }, { t: ' and ' }, { t: 'AI', c: LIME, b: true }, { t: '.' }] },
    { text: [{ t: 'Flip side of the stack: ' }, { t: 'ethical hacker', c: VIOLET, b: true }, { t: ' on challenge platforms' }] },
    { text: [{ t: 'and ' }, { t: 'bug bounty', c: CYAN, b: true }, { t: ' programs. Break cleanly to build stronger.' }] },
  ],
});

panel('scope', {
  title: 'scope & rules of engagement', color: VIOLET, lh: 34,
  lines: [
    { tag: 'FOCUS', c: CYAN,  text: 'web app security · api abuse · smart-contract auditing' },
    { tag: 'SCOPE', c: VIOLET,  text: 'responsible disclosure only — coordinated, scoped, ethical' },
    { tag: 'RULES', c: MUTED, text: 'no scope-creep · no PII exfil · no public PoCs before patch' },
  ],
});

panel('focuslog', {
  title: 'focus.log', label: 'Current focus log', lh: 32,
  lines: [
    { tag: 'INFO ', c: LIME, text: 'building decentralized applications' },
    { tag: 'INFO ', c: LIME, text: 'designing & integrating APIs' },
    { tag: 'TASK ', c: CYAN, text: 'hunting bugs — responsibly' },
    { tag: 'INFO ', c: LIME, text: 'contributing to open source' },
    { tag: 'DEBUG', c: VIOLET, text: 'exploring AI / ML' },
    { tag: 'INFO ', c: LIME, text: 'crafting high-performance solutions' },
    { tag: 'WARN ', c: GOLD, text: 'coffee level critical... refilling', tc: MUTED },
  ],
});

panel('disclosure', {
  title: 'disclosure policy — how I report', color: LIME, lh: 32,
  lines: [
    { n: 1, text: 'Reports written in English or French, per the program policy.' },
    { n: 2, text: 'Encrypted communication available via PGP.' },
    { n: 3, text: 'No exploitation beyond the minimum required for proof of concept.' },
    { n: 4, text: 'Strict adherence to scope, rules of engagement & disclosure timelines.' },
    { n: 5, text: 'No public disclosure until the fix is deployed & coordinated.' },
  ],
});

button('follow',  `Follow @${USER}`, 'github', CYAN, true);
button('sponsor', 'Say hi', 'protonmail', VIOLET, false);

console.log('generated design assets in', OUT);
