/**
 * Server-side environment-context estimate, reachable over curl / HTTP.
 *
 * The in-browser scan reads OS-level signals (timezone, fonts, Intl locale, …)
 * that a plain HTTP request can't see. This endpoint instead estimates the risk
 * from what Cloudflare exposes on the trusted inbound `request.cf` object:
 *   - `request.cf.timezone` — IANA timezone of the requester's IP (the big one)
 *   - `request.cf.country`  — country of the requester's IP
 *   - `accept-language`       — browser/UA language preferences
 *   - `user-agent`            — OS/vendor guess for the emoji signal
 *
 * Fonts (Chinese + vendor faces), Intl locale and WebRTC IP leak are
 * browser-only, so the score is computed over the measurable weight (62/100)
 * and normalised to 0–100. It reuses the exact same pure scorers as the client
 * so results stay consistent.
 *
 * Response format:
 *   - default (curl, browser, …)                      → pretty plain-text report
 *       · terminals get ANSI colour, browsers get plain text (`?color=0/1` forces)
 *   - `Accept: application/json` (or `?format=json`)  → JSON
 *   - `?format=text` forces the report even for JSON clients
 *   - `?lang=zh` / `?lang=en` (default: Accept-Language) → localised output
 *
 * Needs the Cloudflare adapter + on-demand rendering. Cloudflare geo metadata
 * is absent in local preview, where those signals are reported as unmeasured.
 */
import type { APIRoute } from 'astro';
import {
  SIGNALS,
  riskBand,
  scoreTimezone,
  scoreLanguages,
  scoreEmojiVendor,
  scoreCnBrowser,
  scoreCnDevice,
  type RiskBand,
  type SignalId,
} from '../../config/signals';
import { useTranslations, type Lang } from '../../i18n/ui';

export const prerender = false;

const SITE = 'https://fuckclaude.qimake.com';

const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin': SITE,
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const COMMON_HEADERS: Record<string, string> = {
  ...CORS,
  'Cross-Origin-Resource-Policy': 'cross-origin',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Robots-Tag': 'noindex',
};

interface CloudflareRequest extends Request {
  cf?: {
    country?: string | null;
    timezone?: string;
    asn?: number;
    asOrganization?: string;
  };
}

interface SignalResult {
  id: SignalId;
  name: string;
  weight: number;
  measured: boolean;
  value: string | null;
  score: number | null;
  contribution: number;
}

interface Analysis {
  score: number;
  band: RiskBand;
  measuredWeight: number;
  totalWeight: number;
  rawContribution: number;
  geo: {
    country: string | null;
    timezone: string | null;
    asn: number | null;
    asOrganization: string | null;
  };
  signals: SignalResult[];
}

function parseAcceptLanguage(header: string): string[] {
  return header
    .slice(0, 512)
    .split(',')
    .map((part) => part.split(';')[0].trim())
    .filter(Boolean)
    .slice(0, 16);
}

/** Minutes east of UTC for an IANA timezone (Asia/Shanghai → 480), or null. */
function tzOffsetEastMinutes(timeZone: string): number | null {
  if (!timeZone) return null;
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'shortOffset',
    }).formatToParts(new Date());
    const name = parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
    const m = name.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
    if (!m) return 0;
    const sign = m[1] === '-' ? -1 : 1;
    const h = parseInt(m[2] ?? '0', 10);
    const min = parseInt(m[3] ?? '0', 10);
    return sign * (h * 60 + min);
  } catch {
    return null;
  }
}

function fmtOffset(min: number | null): string {
  if (min === null) return 'unknown';
  const sign = min >= 0 ? '+' : '-';
  const h = Math.abs(min) / 60;
  return `UTC${sign}${Number.isInteger(h) ? h : h.toFixed(1)}`;
}

function pickLang(url: URL, acceptLang: string[]): Lang {
  const q = (url.searchParams.get('lang') || '').toLowerCase();
  if (q === 'zh' || q === 'en') return q;
  return (acceptLang[0] || '').toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

/**
 * The human-readable report is the default. JSON is opt-in so a bare
 * `curl`/browser hit never dumps raw JSON — only clients that explicitly ask
 * for it (`?format=json`, or `Accept: application/json` from fetch/XHR) get it.
 */
function wantsJson(url: URL, req: Request): boolean {
  const fmt = (url.searchParams.get('format') || '').toLowerCase();
  if (fmt === 'json') return true;
  if (fmt === 'text' || fmt === 'txt') return false;
  return (req.headers.get('accept') || '').toLowerCase().includes('application/json');
}

/**
 * ANSI colour only for terminal clients — a browser hitting the URL would show
 * raw escape codes, so it gets plain text. `?color=0` / `?color=1` force it.
 */
function wantsColor(url: URL, req: Request): boolean {
  const q = (url.searchParams.get('color') || '').toLowerCase();
  if (url.searchParams.has('no-color') || ['0', 'false', 'no', 'off'].includes(q)) return false;
  if (['1', 'true', 'yes', 'on', 'force'].includes(q)) return true;
  const accept = (req.headers.get('accept') || '').toLowerCase();
  if (accept.includes('text/html')) return false;
  const ua = (req.headers.get('user-agent') || '').toLowerCase();
  return !/mozilla|chrome\/|safari\/|firefox\/|edg\//.test(ua);
}

function analyze(req: Request, lang: Lang): Analysis {
  const t = useTranslations(lang);
  const cf = (req as CloudflareRequest).cf;
  const tz = cf?.timezone || '';
  const country = cf?.country || '';
  const asn = typeof cf?.asn === 'number' ? cf.asn : null;
  const asOrganization = cf?.asOrganization || null;
  const acceptLang = parseAcceptLanguage(req.headers.get('accept-language') || '');
  const ua = (req.headers.get('user-agent') || '').slice(0, 1024);

  const offsetEast = tzOffsetEastMinutes(tz);
  const emoji = scoreEmojiVendor(ua);
  const cnBrowser = scoreCnBrowser(ua);
  const cnDevice = scoreCnDevice(ua);

  const measured: Partial<Record<SignalId, { value: string; score: number }>> = {
    language: { value: acceptLang.join(', ') || 'unknown', score: scoreLanguages(acceptLang) },
    cnBrowser: { value: cnBrowser.name ?? 'none detected', score: cnBrowser.score },
    deviceVendor: { value: cnDevice.name ?? 'none detected', score: cnDevice.score },
    emoji: { value: `${emoji.vendor} style`, score: emoji.score },
  };

  if (tz) {
    measured.timezone = { value: tz, score: scoreTimezone(tz) };
  }
  if (offsetEast !== null) {
    measured.timezoneOffset = {
      value: fmtOffset(offsetEast),
      score: offsetEast === 480 ? 0.7 : 0,
    };
  }

  let rawContribution = 0;
  let measuredWeight = 0;
  let totalWeight = 0;

  const signals: SignalResult[] = SIGNALS.map((s) => {
    totalWeight += s.weight;
    const m = measured[s.id];
    if (m) {
      const contribution = Math.round(m.score * s.weight);
      rawContribution += contribution;
      measuredWeight += s.weight;
      return {
        id: s.id,
        name: t(`signal.${s.id}.name`),
        weight: s.weight,
        measured: true,
        value: m.value,
        score: Math.round(m.score * 100) / 100,
        contribution,
      };
    }
    return {
      id: s.id,
      name: t(`signal.${s.id}.name`),
      weight: s.weight,
      measured: false,
      value: null,
      score: null,
      contribution: 0,
    };
  });

  const score = measuredWeight ? Math.round((rawContribution / measuredWeight) * 100) : 0;

  return {
    score,
    band: riskBand(score),
    measuredWeight,
    totalWeight,
    rawContribution,
    geo: {
      country: country || null,
      timezone: tz || null,
      asn,
      asOrganization,
    },
    signals,
  };
}

function jsonBody(a: Analysis, lang: Lang) {
  const t = useTranslations(lang);
  return {
    app: 'QIM Developer Signal Lab',
    estimate: true,
    officialAnthropicDecision: false,
    lang,
    score: a.score,
    band: a.band,
    verdict: t(`band.${a.band}.title`),
    message: t(`band.${a.band}.desc`),
    coverage: { measuredWeight: a.measuredWeight, totalWeight: a.totalWeight },
    geo: a.geo,
    signals: a.signals,
    note:
      lang === 'zh'
        ? 'QIM 的服务端环境估算,基于 Cloudflare 附加的 IP 衍生地区/网络资料与请求头。它不是 Anthropic 的决定,也可能与 Claude Code 的实际出口不同。'
        : 'QIM server-side environment estimate from Cloudflare IP-derived region/network metadata and request headers. It is not an Anthropic decision and can differ from the actual Claude Code egress.',
    docs: lang === 'zh' ? `${SITE}/zh/` : `${SITE}/`,
  };
}

function textBody(a: Analysis, lang: Lang, color: boolean): string {
  const t = useTranslations(lang);

  // Minimal ANSI painter — a no-op when colour is disabled (browsers/pipes).
  const paint = (open: string) => (s: string) => (color ? `\x1b[${open}m${s}\x1b[0m` : s);
  const accent = paint('38;5;43'); // QIM teal
  const dim = paint('38;5;245'); // muted grey
  const bold = paint('1');
  const bandColor = { low: paint('38;5;71'), medium: paint('38;5;178'), high: paint('38;5;167') }[
    a.band
  ];

  const L =
    lang === 'zh'
      ? {
          subtitle: '开发者信号实验室',
          tagline: 'QIM 环境背景估算 · 非 Anthropic 判断',
          score: '实验分',
          measured: '服务端可见信号',
          browserOnly: '仅浏览器可测(curl 看不到)',
          coverage: '覆盖',
          geo: '归属地',
          noteBody: '只作环境研究参考,且可能不同于 Claude Code 实际出口。',
          full: '完整检测',
          hintJson: 'JSON      → 加 ?format=json',
          hintLang: '语言      → 自动跟随 Accept-Language',
          none: '无',
        }
      : {
          subtitle: 'Developer Signal Lab',
          tagline: 'QIM environment context · not an Anthropic decision',
          score: 'Experimental score',
          measured: 'Signals visible server-side',
          browserOnly: 'Browser-only (invisible to curl)',
          coverage: 'Coverage',
          geo: 'Geo',
          noteBody: 'Research context only; it can differ from actual Claude Code egress.',
          full: 'Full scan',
          hintJson: 'JSON      → add ?format=json',
          hintLang: 'Language  → follows Accept-Language',
          none: 'none',
        };

  const home = lang === 'zh' ? `${SITE}/zh/` : `${SITE}/`;
  const geoStr = [
    a.geo.country,
    a.geo.timezone,
    a.geo.asn ? `AS${a.geo.asn}` : null,
    a.geo.asOrganization,
  ].filter(Boolean).join(' · ') || L.none;
  const browserOnly =
    a.signals
      .filter((s) => !s.measured)
      .map((s) => s.name)
      .join(' · ') || L.none;
  const measured = a.signals
    .filter((s) => s.measured)
    .sort((x, y) => y.contribution - x.contribution);

  const bar = accent('│');
  const rule = (corner: string) => accent(corner + '─'.repeat(52));
  const badge = bandColor('●');

  const out: string[] = [];
  out.push(rule('╭'));
  out.push(`${bar}  ${accent(bold('QIM'))}  ${dim(L.subtitle)}`);
  out.push(`${bar}  ${dim(L.tagline)}`);
  out.push(bar);
  out.push(
    `${bar}  ${L.score}  ${bandColor(bold(`${a.score}/100`))}   ${badge} ${bandColor(
      t(`band.${a.band}.title`).toUpperCase(),
    )}`,
  );
  out.push(`${bar}  ${t(`band.${a.band}.desc`)}`);
  out.push(bar);
  out.push(`${bar}  ${dim(L.measured)}`);
  for (const s of measured) {
    const c = (s.contribution > 0 ? `+${s.contribution}` : `${s.contribution}`).padStart(4);
    const mark = s.contribution > 0 ? badge : dim('·');
    out.push(`${bar}    ${mark} ${dim(c)}  ${s.name}${s.value ? dim(` · ${s.value}`) : ''}`);
  }
  out.push(bar);
  out.push(`${bar}  ${dim(L.browserOnly)}`);
  out.push(`${bar}    ${dim(browserOnly)}`);
  out.push(bar);
  out.push(`${bar}  ${dim(`${L.coverage} ${a.measuredWeight}/${a.totalWeight}  ·  ${L.geo} ${geoStr}`)}`);
  out.push(`${bar}  ${dim(L.noteBody)}`);
  out.push(rule('╰'));
  out.push(`   ${accent('→')}  ${L.full}  ${accent(home)}`);
  out.push(`   ${dim(L.hintJson)}`);
  out.push(`   ${dim(L.hintLang)}`);
  out.push('');
  return out.join('\n');
}

export const GET: APIRoute = ({ request, url }) => {
  const acceptLang = parseAcceptLanguage(request.headers.get('accept-language') || '');
  const lang = pickLang(url, acceptLang);
  const analysis = analyze(request, lang);
  const vary = 'Accept, Accept-Language, User-Agent';

  if (!wantsJson(url, request)) {
    return new Response(textBody(analysis, lang, wantsColor(url, request)), {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        Vary: vary,
        ...COMMON_HEADERS,
      },
    });
  }

  return new Response(JSON.stringify(jsonBody(analysis, lang), null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      Vary: vary,
      ...COMMON_HEADERS,
    },
  });
};

export const OPTIONS: APIRoute = () =>
  new Response(null, { status: 204, headers: COMMON_HEADERS });
