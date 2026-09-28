// Self-hosted stats cards for the kiyomasanaki profile — no flaky third-party image
// services. When run inside GitHub Actions (GH_TOKEN present) it refreshes
// assets/stats.json from the GitHub API, then renders the SVGs. Locally (no
// token) it just re-renders from the committed stats.json.
//   node assets/stats.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const OUT = dirname(fileURLToPath(import.meta.url));
const USER = process.env.STATS_USER || 'kiyomasanaki';
const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

import { INK2, LINE, IVORY, MUTED, VERM, GOLD, JADE, FONT, W, esc, card, heading, svg } from './theme.mjs';

const LANG_COLORS = [VERM, GOLD, JADE, '#7aa2f7', '#c792ea', '#f78c6c', '#89ddff', '#a6accd'];

// -------- optional live fetch (GitHub Actions) --------------------------
async function gh(path) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json', 'User-Agent': USER },
  });
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return res.json();
}
async function refresh() {
  const user = await gh(`/users/${USER}`);
  let repos = [], page = 1;
  while (true) {
    const batch = await gh(`/users/${USER}/repos?per_page=100&type=owner&page=${page}`);
    repos = repos.concat(batch);
    if (batch.length < 100) break;
    page++;
  }
  const owned = repos.filter((r) => !r.fork);
  const stars = owned.reduce((a, r) => a + (r.stargazers_count || 0), 0);
  const bytes = {};
  for (const r of owned) {
    try {
      const langs = await gh(`/repos/${r.full_name}/languages`);
      for (const [k, v] of Object.entries(langs)) bytes[k] = (bytes[k] || 0) + v;
    } catch { /* skip */ }
  }
  const total = Object.values(bytes).reduce((a, b) => a + b, 0) || 1;
  const langs = Object.entries(bytes)
    .sort((a, b) => b[1] - a[1]).slice(0, 6)
    .map(([name, v]) => ({ name, pct: Math.round((v * 1000) / total) / 10 }));
  const prs = (await gh(`/search/issues?q=author:${USER}+type:pr&per_page=1`)).total_count;
  const issues = (await gh(`/search/issues?q=author:${USER}+type:issue&per_page=1`)).total_count;
  const data = { repos: user.public_repos, followers: user.followers, stars, prs, issues, langs };
  writeFileSync(join(OUT, 'stats.json'), JSON.stringify(data, null, 2));
  return data;
}

// -------- rendering -----------------------------------------------------
const PAD = 28;
function overview(d) {
  const H = 156;
  const cells = [
    { n: d.repos, l: 'repositories' },
    { n: d.stars, l: 'stars earned' },
    { n: d.prs, l: 'pull requests' },
    { n: d.issues, l: 'issues opened' },
  ];
  const gap = 12, cw = (W - PAD * 2 - gap * (cells.length - 1)) / cells.length;
  let body = heading(PAD, 28, 'overview');
  cells.forEach((c, i) => {
    const x = PAD + i * (cw + gap), col = i % 2 === 0 ? VERM : GOLD;
    body += `<rect x="${x}" y="52" width="${cw}" height="80" rx="10" fill="${INK2}" stroke="${LINE}"/>
<rect x="${x + 16}" y="52" width="28" height="3" rx="1.5" fill="${col}"/>
<text x="${x + 16}" y="86" font-family="${FONT}" font-size="32" font-weight="800" fill="${IVORY}" dominant-baseline="central">${esc(c.n)}</text>
<text x="${x + 16}" y="116" font-family="${FONT}" font-size="12" fill="${MUTED}" dominant-baseline="central" letter-spacing="0.5">${esc(c.l.toUpperCase())}</text>`;
  });
  writeFileSync(join(OUT, 'stat-overview.svg'), svg(W, H, 'GitHub overview', `${card(W, H)}\n${body}`));
}

function languages(d) {
  const langs = d.langs.slice(0, 6);
  const perRow = 3, rowH = 30, barY = 56, barH = 14, barW = W - PAD * 2;
  const ly0 = 100, H = ly0 + Math.ceil(langs.length / perRow) * rowH + 10;
  const colW = barW / perRow;
  let x = PAD, bar = '', legend = '';
  langs.forEach((l, i) => {
    const col = LANG_COLORS[i % LANG_COLORS.length];
    const segW = Math.max(3, (barW * l.pct) / 100);
    bar += `<rect x="${x.toFixed(1)}" y="${barY}" width="${segW.toFixed(1)}" height="${barH}" fill="${col}"/>`;
    x += segW + 2;
    const lx = PAD + colW * (i % perRow), ly = ly0 + Math.floor(i / perRow) * rowH;
    legend += `<rect x="${lx}" y="${ly - 5}" width="10" height="10" rx="2" fill="${col}"/>
<text x="${lx + 20}" y="${ly}" font-family="${FONT}" font-size="13.5" fill="${IVORY}" dominant-baseline="central">${esc(l.name)}</text>
<text x="${lx + colW - 24}" y="${ly}" font-family="${FONT}" font-size="13" font-weight="700" fill="${MUTED}" text-anchor="end" dominant-baseline="central">${l.pct}%</text>`;
  });
  const defs = `<clipPath id="bc"><rect x="${PAD}" y="${barY}" width="${barW}" height="${barH}" rx="7"/></clipPath>`;
  const body = `${card(W, H, { spine: GOLD })}
${heading(PAD, 28, 'most used languages', GOLD)}
<rect x="${PAD}" y="${barY}" width="${barW}" height="${barH}" rx="7" fill="${INK2}"/>
<g clip-path="url(#bc)">${bar}</g>
${legend}`;
  writeFileSync(join(OUT, 'stat-langs.svg'), svg(W, H, 'Most used languages', body, defs));
}

// -------- main ----------------------------------------------------------
let data;
if (TOKEN) {
  try { data = await refresh(); console.log('stats refreshed from API'); }
  catch (e) { console.error('API refresh failed, using committed stats.json:', e.message); }
}
if (!data) data = JSON.parse(readFileSync(join(OUT, 'stats.json'), 'utf8'));
overview(data);
languages(data);
console.log('rendered stat-overview.svg + stat-langs.svg');
