/**
 * Generates the QIM-branded favicon, PWA icons, and Open Graph artwork.
 * The paths mirror the canonical qim-logo.svg used by qimake.com.
 *
 * Run: node scripts/gen-assets.mjs
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const INK = '#0B1220';
const INK_2 = '#172033';
const WHITE = '#FFFFFF';
const TEAL = '#39C5BB';
const TEAL_DARK = '#20A99F';
const YELLOW = '#F5DF4D';
const MUTED = '#A8B4C4';

function qimLogo(color = WHITE) {
  return `<g>
    <circle cx="16" cy="18" r="10" stroke="${color}" stroke-width="8" fill="none"/>
    <path d="M24 18v14" stroke="${color}" stroke-width="8" stroke-linecap="round"/>
    <circle cx="24" cy="34" r="2.5" fill="${TEAL}"/>
    <circle cx="46" cy="11" r="4" fill="${YELLOW}"/>
    <path d="M46 18v14" stroke="${color}" stroke-width="8" stroke-linecap="round"/>
    <path d="M66 32V21c0-3.866 3.134-7 7-7s7 3.134 7 7v11" stroke="${color}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M80 32V21c0-3.866 3.134-7 7-7s7 3.134 7 7v11" stroke="${color}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>`;
}

function iconSvg(radius) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
    <rect width="64" height="64" rx="${radius}" fill="${INK}"/>
    <circle cx="28" cy="28" r="12" stroke="${WHITE}" stroke-width="8" fill="none"/>
    <path d="M36 28v18" stroke="${WHITE}" stroke-width="8" stroke-linecap="round"/>
    <circle cx="37" cy="49" r="3.5" fill="${TEAL}"/>
    <circle cx="49" cy="15" r="5" fill="${YELLOW}"/>
  </svg>`;
}

const logoScale = 2.15;
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${INK}"/>
  <path d="M0 470 380 90h250L190 630H0Z" fill="${INK_2}"/>
  <path d="M760 0h440v630H560Z" fill="${TEAL_DARK}" opacity="0.09"/>
  <g opacity="0.18" stroke="${WHITE}">
    <path d="M0 88h1200M0 176h1200M0 264h1200M0 352h1200M0 440h1200M0 528h1200"/>
    <path d="M88 0v630M176 0v630M264 0v630M352 0v630M440 0v630M528 0v630"/>
  </g>
  <g transform="translate(72 58) scale(${logoScale})">${qimLogo(WHITE)}</g>
  <rect x="935" y="66" width="183" height="44" rx="9" fill="${YELLOW}"/>
  <text x="1026" y="95" text-anchor="middle" font-family="Menlo, monospace" font-size="17" font-weight="700" fill="${INK}">PUBLIC INTEREST</text>
  <text x="72" y="258" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-size="78" font-weight="750" fill="${WHITE}">Developer Signal Lab</text>
  <text x="72" y="338" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-size="36" font-weight="600" fill="${TEAL}">Independent environment diagnostics</text>
  <text x="72" y="399" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-size="26" fill="${MUTED}">Official policy · third-party reports · QIM hypotheses</text>
  <g transform="translate(72 462)">
    <rect width="260" height="46" rx="23" fill="none" stroke="${TEAL}"/>
    <circle cx="27" cy="23" r="5" fill="${TEAL}"/>
    <text x="46" y="31" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-size="20" fill="${WHITE}">Local scoring</text>
    <rect x="276" width="275" height="46" rx="23" fill="none" stroke="${TEAL}"/>
    <circle cx="303" cy="23" r="5" fill="${TEAL}"/>
    <text x="322" y="31" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-size="20" fill="${WHITE}">No trackers or ads</text>
  </g>
  <text x="72" y="572" font-family="Menlo, monospace" font-size="21" fill="${MUTED}">signals.qimake.com · Not affiliated with Anthropic</text>
</svg>`;

const rasterizeIcon = (svg, size) =>
  sharp(Buffer.from(svg), { density: 72 * (size / 64) }).resize(size, size);

await writeFile('public/favicon.svg', `${iconSvg(14)}\n`);
await rasterizeIcon(iconSvg(0), 180).png().toFile('public/apple-touch-icon.png');
await rasterizeIcon(iconSvg(14), 192).png().toFile('public/icon-192.png');
await rasterizeIcon(iconSvg(14), 512).png().toFile('public/icon-512.png');
await sharp(Buffer.from(ogSvg)).png().toFile('public/og.png');

console.log('QIM visual assets written to public/');
