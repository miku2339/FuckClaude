/**
 * Renders the scan result into a square 1080×1080 PNG so it can be attached to
 * a native share (Web Share API `files`) or saved and posted to image-first
 * apps. Everything is drawn on a canvas from
 * same-origin assets, so the result never leaves the browser.
 */
import type { Lang } from '../i18n/ui';
import type { RiskBand } from '../config/signals';

export interface CardHit {
  name: string;
  contribution: number;
  verdict: RiskBand;
}

export interface CardData {
  lang: Lang;
  title: string;
  score: number;
  band: RiskBand;
  bandTitle: string;
  bandDesc: string;
  outOf: string;
  hits: CardHit[];
  url: string;
  brand: string;
}

const SIZE = 1080;
const C = {
  bg: '#f7f8f4',
  surface: '#ffffff',
  border: '#dbe2df',
  borderStrong: '#c5d0cc',
  text: '#0b1220',
  muted: '#5d6878',
  muted2: '#7b8796',
  accent: '#20a99f',
  accentStrong: '#08756e',
  low: '#22a65a',
  medium: '#b77710',
  high: '#c14b4b',
  track: '#e7ece9',
};
const SANS =
  "'Avenir Next',Avenir,-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif";

const bandColor = (b: RiskBand) => (b === 'low' ? C.low : b === 'medium' ? C.medium : C.high);

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

/** Wrap that works for both space-separated Latin and space-less CJK text. */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const tokens = text.match(/[\u4e00-\u9fff]|[^\u4e00-\u9fff\s]+|\s+/g) || [];
  const lines: string[] = [];
  let line = '';
  for (const tk of tokens) {
    const test = line + tk;
    if (ctx.measureText(test).width > maxWidth && line.trim()) {
      lines.push(line.trimEnd());
      line = tk.replace(/^\s+/, '');
    } else {
      line = test;
    }
  }
  if (line.trim()) lines.push(line.trimEnd());
  return lines;
}

async function loadImage(src: string): Promise<HTMLImageElement | null> {
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
    await img.decode();
    return img;
  } catch {
    return null;
  }
}

export async function renderResultCard(d: CardData): Promise<Blob | null> {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const accent = bandColor(d.band);

  // Background + framing border.
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.strokeStyle = C.border;
  ctx.lineWidth = 2;
  roundRect(ctx, 24, 24, SIZE - 48, SIZE - 48, 40);
  ctx.stroke();

  // Header: the current QIM wordmark + product name, URL on the right.
  const logo = await loadImage('/qim-logo.svg');
  ctx.textBaseline = 'middle';
  const headY = 92;
  if (logo) ctx.drawImage(logo, 80, headY - 30, 180, 60);
  ctx.textAlign = 'left';
  ctx.font = `700 27px ${SANS}`;
  ctx.fillStyle = C.text;
  ctx.fillText(d.brand, logo ? 282 : 80, headY + 1);
  ctx.textAlign = 'right';
  ctx.font = `500 24px ${SANS}`;
  ctx.fillStyle = C.muted2;
  ctx.fillText('fuckclaude.qimake.com', SIZE - 80, headY + 1);

  // Title.
  ctx.textAlign = 'center';
  ctx.fillStyle = C.text;
  ctx.font = `700 52px ${SANS}`;
  const titleLines = wrapText(ctx, d.title, SIZE - 200).slice(0, 2);
  let ty = 208;
  for (const line of titleLines) {
    ctx.fillText(line, SIZE / 2, ty);
    ty += 64;
  }

  // Score ring: deliberately neutral, with no Anthropic likeness or mascot.
  const midY = 470;
  const ringCx = SIZE / 2;
  const ringR = 150;
  const ringW = 30;

  // Score ring.
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(ringCx, midY, ringR, 0, Math.PI * 2);
  ctx.strokeStyle = C.track;
  ctx.lineWidth = ringW;
  ctx.stroke();
  const frac = Math.max(0, Math.min(1, d.score / 100));
  if (frac > 0) {
    ctx.beginPath();
    ctx.arc(ringCx, midY, ringR, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac);
    ctx.strokeStyle = accent;
    ctx.lineWidth = ringW;
    ctx.stroke();
  }
  ctx.fillStyle = C.text;
  ctx.font = `700 130px ${SANS}`;
  ctx.textAlign = 'center';
  ctx.fillText(String(d.score), ringCx, midY - 6);
  ctx.fillStyle = C.muted2;
  ctx.font = `500 30px ${SANS}`;
  ctx.fillText(d.outOf, ringCx, midY + 78);

  // Verdict badge.
  ctx.font = `700 34px ${SANS}`;
  const badgeText = d.bandTitle;
  const bw = ctx.measureText(badgeText).width + 72;
  const badgeY = 700;
  roundRect(ctx, SIZE / 2 - bw / 2, badgeY - 34, bw, 68, 34);
  ctx.fillStyle = accent;
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillText(badgeText, SIZE / 2, badgeY + 1);

  // Verdict description.
  ctx.fillStyle = C.muted;
  ctx.font = `500 30px ${SANS}`;
  const descLines = wrapText(ctx, d.bandDesc, SIZE - 240).slice(0, 2);
  let dy = 776;
  for (const line of descLines) {
    ctx.fillText(line, SIZE / 2, dy);
    dy += 42;
  }

  // Matched-signal chips (centred, up to two rows).
  const chipsY = descLines.length > 1 ? 892 : 862;
  drawChips(ctx, d.hits, chipsY, SIZE - 160);

  // Footer.
  ctx.fillStyle = C.muted2;
  ctx.font = `500 26px ${SANS}`;
  ctx.textAlign = 'center';
  ctx.fillText(
    d.lang === 'zh'
      ? 'QIM 公益开发者项目 · fuckclaude.qimake.com'
      : 'QIM public-interest developer project · fuckclaude.qimake.com',
    SIZE / 2,
    SIZE - 68,
  );

  return await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
}

function drawChips(ctx: CanvasRenderingContext2D, hits: CardHit[], startY: number, maxRowWidth: number) {
  if (!hits.length) return;
  ctx.font = `600 26px ${SANS}`;
  const padX = 22;
  const gap = 14;
  const h = 52;

  const chips = [...hits]
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 6)
    .map((hit) => {
      const label = `${hit.name}  +${hit.contribution}`;
      return { label, verdict: hit.verdict, w: ctx.measureText(label).width + padX * 2 };
    });

  // Greedy pack into rows that fit maxRowWidth.
  const rows: { chips: typeof chips; width: number }[] = [];
  let row: typeof chips = [];
  let rowW = 0;
  for (const chip of chips) {
    const add = chip.w + (row.length ? gap : 0);
    if (rowW + add > maxRowWidth && row.length) {
      rows.push({ chips: row, width: rowW });
      row = [];
      rowW = 0;
    }
    row.push(chip);
    rowW += chip.w + (row.length > 1 ? gap : 0);
  }
  if (row.length) rows.push({ chips: row, width: rowW });

  ctx.textBaseline = 'middle';
  let y = startY;
  for (const r of rows.slice(0, 2)) {
    let x = (ctx.canvas.width - r.width) / 2;
    for (const chip of r.chips) {
      const col = bandColor(chip.verdict);
      roundRect(ctx, x, y - h / 2, chip.w, h, h / 2);
      ctx.fillStyle = C.surface;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = col;
      ctx.stroke();
      ctx.fillStyle = col;
      ctx.textAlign = 'center';
      ctx.fillText(chip.label, x + chip.w / 2, y + 1);
      x += chip.w + gap;
    }
    y += h + 16;
  }
}
