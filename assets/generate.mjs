// SVG asset generator for the kiyomasanaki GitHub profile ("sumi & vermilion").
// Solid ink cards with a vermilion spine — readable on every GitHub theme.
// Run:  node assets/generate.mjs   (requires: npm i simple-icons)
import * as si from 'simple-icons';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { INK, INK2, LINE, IVORY, MUTED, VERM, GOLD, JADE, FONT, W, acc, esc, tw, card, heading, svg } from './theme.mjs';

const OUT = dirname(fileURLToPath(import.meta.url));
const out = (file, content) => writeFileSync(join(OUT, file), content);

const USER = 'kiyomasanaki';
const PAD = 28;

// fallback glyph (hexagon target) for brands missing from simple-icons
const FALLBACK = 'M12 1.6l9 5.2v10.4l-9 5.2-9-5.2V6.8zM12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 2.4a2.1 2.1 0 110 4.2 2.1 2.1 0 010-4.2z';
const iconPath = (slug) => si['si' + slug.charAt(0).toUpperCase() + slug.slice(1)]?.path ?? FALLBACK;
function icon(slug, x, y, size, color) {
  return `<g transform="translate(${x},${y}) scale(${(size / 24).toFixed(4)})"><path d="${iconPath(slug)}" fill="${color}"/></g>`;
}

// ---- hero --------------------------------------------------------------
function hero() {
  const H = 230;
  const name = USER;
  const nfs = 50, nw = tw(name, nfs);
  const dots = `<pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1" fill="${LINE}"/></pattern>
<linearGradient id="fade" x1="0" x2="1"><stop offset="0.35" stop-color="${INK}"/><stop offset="1" stop-color="${INK}" stop-opacity="0"/></linearGradient>
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
  const sx = W - 150, sy = 52, ss = 110;
  const stamp = `<g transform="rotate(-6 ${sx + ss / 2} ${sy + ss / 2})">
<rect x="${sx}" y="${sy}" width="${ss}" height="${ss}" rx="12" fill="none" stroke="${VERM}" stroke-width="3"/>
<rect x="${sx + 8}" y="${sy + 8}" width="${ss - 16}" height="${ss - 16}" rx="7" fill="${VERM}" fill-opacity="0.12" stroke="${VERM}" stroke-opacity="0.5"/>
<text x="${sx + ss / 2}" y="${sy + ss / 2 - 2}" font-family="${FONT}" font-size="40" font-weight="800" fill="${VERM}" text-anchor="middle" dominant-baseline="central">KM</text>
<text x="${sx + ss / 2}" y="${sy + ss - 22}" font-family="${FONT}" font-size="9.5" font-weight="700" fill="${VERM}" text-anchor="middle" dominant-baseline="central" letter-spacing="2">EST·FR</text>
</g>`;
  const body = `${card(W, H)}
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="14" fill="url(#dots)"/>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="14" fill="url(#fade)"/>
<text x="${PAD + 8}" y="44" font-family="${FONT}" font-size="13" fill="${MUTED}" dominant-baseline="central" xml:space="preserve"><tspan fill="${VERM}" font-weight="700">~/</tspan>${USER}  <tspan fill="${LINE}">│</tspan>  full-stack dev  <tspan fill="${LINE}">│</tspan>  ethical hacker</text>
<text x="${PAD + 4}" y="96" font-family="${FONT}" font-size="${nfs}" font-weight="800" fill="${IVORY}" dominant-baseline="central" textLength="${nw}" lengthAdjust="spacingAndGlyphs">${name}</text>
<rect class="cur" x="${PAD + 12 + nw}" y="74" width="24" height="46" fill="${VERM}"/>
<text x="${PAD + 8}" y="140" font-family="${FONT}" font-size="15" fill="${IVORY}" dominant-baseline="central" xml:space="preserve">Breaking stuff <tspan fill="${VERM}" font-weight="700">to make it stronger.</tspan></text>
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
<text x="${PAD}" y="${H / 2}" font-family="${FONT}" font-size="15" font-weight="800" fill="${VERM}" dominant-baseline="central">${num}</text>
<rect x="${PAD + 30}" y="${H / 2 - 9}" width="1.5" height="18" fill="${LINE}"/>
<text x="${PAD + 46}" y="${H / 2}" font-family="${FONT}" font-size="17" font-weight="800" fill="${IVORY}" dominant-baseline="central" letter-spacing="1">${esc(title.toUpperCase())}</text>
<rect x="${W - PAD - cw - 20}" y="${H / 2 - 14}" width="${cw + 20}" height="28" rx="7" fill="${INK2}" stroke="${LINE}"/>
<text x="${W - PAD - cw - 10}" y="${H / 2}" font-family="${FONT}" font-size="12.5" fill="${MUTED}" dominant-baseline="central" textLength="${cw}" xml:space="preserve">${esc(cmd)}</text>`;
  out(`header-${name}.svg`, svg(W, H, `${num} ${title} — ${command}`, body));
}

// ---- skill card (chips) ------------------------------------------------
const C_H = 40, C_ICON = 18, C_PADL = 14, C_GAP = 10, C_PADR = 16, C_FS = 14;
const chipW = (l) => C_PADL + C_ICON + C_GAP + tw(l, C_FS) + C_PADR;
function chip(x, y, label, slug, color) {
  return `<rect x="${x}" y="${y}" width="${chipW(label)}" height="${C_H}" rx="9" fill="${INK2}" stroke="${LINE}"/>
<rect x="${x}" y="${y + C_H - 2.5}" width="${chipW(label)}" height="2.5" rx="1.2" fill="${color}" fill-opacity="0.75"/>
${icon(slug, x + C_PADL, y + (C_H - C_ICON) / 2, C_ICON, color)}
<text x="${x + C_PADL + C_ICON + C_GAP}" y="${y + C_H / 2}" font-family="${FONT}" font-size="${C_FS}" font-weight="500" fill="${IVORY}" dominant-baseline="central" textLength="${tw(label, C_FS)}" lengthAdjust="spacingAndGlyphs">${esc(label)}</text>`;
}
function skillCard(name, title, items, color = VERM) {
  const inner = W - PAD * 2, gap = 10;
  const rows = [[]]; let rw = 0;
  for (const it of items) {
    const w = chipW(it.label);
    if (rw + w > inner && rows.at(-1).length) { rows.push([]); rw = 0; }
    rows.at(-1).push({ ...it, w }); rw += w + gap;
  }
  const top = 54, H = top + rows.length * (C_H + gap) - gap + 24;
  let chips = '', y = top, i = 0;
  for (const row of rows) {
    let x = PAD;
    for (const it of row) { chips += chip(x, y, it.label, it.slug, acc(i++)); x += it.w + gap; }
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
function panel(name, { title, label, lines, color = VERM, lh = 30 }) {
  const top = title ? 58 : 26;
  const H = top + lines.length * lh + 22;
  let body = title ? heading(PAD, 30, title, color) : '';
  lines.forEach((ln, i) => {
    const y = top + i * lh + lh / 2;
    let x = PAD;
    if (ln.n !== undefined) {
      body += `<text x="${x}" y="${y}" font-family="${FONT}" font-size="12.5" font-weight="700" fill="${ln.c || VERM}" dominant-baseline="central">${String(ln.n).padStart(2, '0')}</text>`;
      x += 34;
    } else if (ln.tag) {
      const w = tw(ln.tag, 11.5) + 16;
      body += `<rect x="${x}" y="${y - 11}" width="${w}" height="22" rx="5" fill="${ln.c || VERM}" fill-opacity="0.14" stroke="${ln.c || VERM}" stroke-opacity="0.45"/>
<text x="${x + w / 2}" y="${y}" font-family="${FONT}" font-size="11.5" font-weight="700" fill="${ln.c || VERM}" text-anchor="middle" dominant-baseline="central">${esc(ln.tag)}</text>`;
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

// ---- tagline (loop strip) ----------------------------------------------
function tagline(words) {
  const H = 46, FS = 13.5, gap = 34;
  const ws = words.map((w) => tw(w, FS));
  const total = ws.reduce((a, b) => a + b, 0) + gap * (words.length - 1);
  const Wt = total + 72;
  let x = 36, body = `<rect x="0.5" y="0.5" width="${Wt - 1}" height="${H - 1}" rx="23" fill="${INK}" stroke="${LINE}"/>`;
  words.forEach((w, i) => {
    body += `<text x="${x}" y="${H / 2}" font-family="${FONT}" font-size="${FS}" font-weight="700" fill="${i === words.length - 1 ? VERM : IVORY}" dominant-baseline="central" textLength="${ws[i]}" letter-spacing="1">${esc(w.toUpperCase())}</text>`;
    x += ws[i];
    if (i < words.length - 1) {
      body += `<path d="M${x + gap / 2 - 4} ${H / 2 - 5}l6 5-6 5" fill="none" stroke="${GOLD}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
      x += gap;
    }
  });
  out('tagline.svg', svg(Wt, H, words.join(' → '), body));
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
], GOLD);
skillCard('chain', 'chain · cloud · ops', [
  { label: 'Ethereum', slug: 'ethereum' }, { label: 'BNB Chain', slug: 'binance' },
  { label: 'Web3.js', slug: 'web3dotjs' }, { label: 'Docker', slug: 'docker' },
  { label: 'Linux', slug: 'linux' }, { label: 'Kali', slug: 'kalilinux' },
]);
skillCard('offsec', 'offsec toolkit', [
  { label: 'Burp Suite', slug: 'burpsuite' }, { label: 'Wireshark', slug: 'wireshark' },
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
], GOLD);

tagline(['build', 'break', 'learn', 'share', 'repeat']);

panel('whoami', {
  title: 'about', label: 'About me', lh: 30,
  lines: [
    { text: [{ t: 'Full-stack developer', c: VERM, b: true }, { t: ' based in ' }, { t: 'France', c: GOLD, b: true }, { t: ' — building robust apps at the' }] },
    { text: [{ t: 'intersection of ' }, { t: 'Web', c: VERM, b: true }, { t: ', ' }, { t: 'Blockchain', c: GOLD, b: true }, { t: ' and ' }, { t: 'AI', c: VERM, b: true }, { t: '.' }] },
    { text: [{ t: 'Flip side of the stack: ' }, { t: 'ethical hacker', c: GOLD, b: true }, { t: ' on challenge platforms' }] },
    { text: [{ t: 'and ' }, { t: 'bug bounty', c: VERM, b: true }, { t: ' programs. Break cleanly to build stronger.' }] },
  ],
});

panel('scope', {
  title: 'scope & rules of engagement', color: GOLD, lh: 34,
  lines: [
    { tag: 'FOCUS', c: VERM,  text: 'web app security · api abuse · smart-contract auditing' },
    { tag: 'SCOPE', c: GOLD,  text: 'responsible disclosure only — coordinated, scoped, ethical' },
    { tag: 'RULES', c: MUTED, text: 'no scope-creep · no PII exfil · no public PoCs before patch' },
  ],
});

panel('focuslog', {
  title: 'focus.log', label: 'Current focus log', lh: 32,
  lines: [
    { tag: 'INFO ', c: JADE, text: 'building decentralized applications' },
    { tag: 'INFO ', c: JADE, text: 'designing & integrating APIs' },
    { tag: 'TASK ', c: VERM, text: 'hunting bugs — responsibly' },
    { tag: 'INFO ', c: JADE, text: 'contributing to open source' },
    { tag: 'DEBUG', c: GOLD, text: 'exploring AI / ML' },
    { tag: 'INFO ', c: JADE, text: 'crafting high-performance solutions' },
    { tag: 'WARN ', c: VERM, text: 'coffee level critical... refilling', tc: MUTED },
  ],
});

panel('disclosure', {
  title: 'disclosure policy — how I report', color: GOLD, lh: 32,
  lines: [
    { n: 1, text: 'Reports written in English or French, per the program policy.' },
    { n: 2, text: 'Encrypted communication available via PGP.' },
    { n: 3, text: 'No exploitation beyond the minimum required for proof of concept.' },
    { n: 4, text: 'Strict adherence to scope, rules of engagement & disclosure timelines.' },
    { n: 5, text: 'No public disclosure until the fix is deployed & coordinated.' },
  ],
});

button('follow',  `Follow @${USER}`, 'github', VERM, true);
button('sponsor', 'Say hi', 'protonmail', GOLD, false);

console.log('generated design assets in', OUT);
