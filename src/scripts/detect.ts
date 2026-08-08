/**
 * Browser entry point for the transparent QIM environment scan.
 * Weighted values remain local. A same-origin edge request returns only the
 * connection metadata Cloudflare already attaches to the page request.
 */
import {
  SIGNALS,
  riskBand,
  signalVerdict,
  type DetectOutcome,
  type RiskBand,
  type SignalDef,
  type SignalId,
} from '../config/signals';
import { useTranslations, type Lang } from '../i18n/ui';
import { renderResultCard, type CardHit } from './share-card';

const SCAN_STEP_MS = 260;
const SETTLE_MS = 90;
const RING_R = 52;
const RING_C = 2 * Math.PI * RING_R;

function currentLang(): Lang {
  return document.documentElement.lang.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

const t = useTranslations(currentLang());
const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function q<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T | null {
  return root.querySelector<T>(selector);
}

interface Hit {
  signal: SignalDef;
  contribution: number;
}

interface EdgeContext {
  country: string | null;
  timezone: string | null;
  asn: number | null;
  asOrganization: string | null;
}

function setRing(total: number) {
  const ring = q<SVGCircleElement>('#score-ring');
  const value = q('#score-value');
  if (ring) {
    ring.style.strokeDasharray = `${RING_C}px`;
    ring.style.strokeDashoffset = `${RING_C * (1 - total / 100)}px`;
  }
  if (value) value.textContent = String(total);
}

function setHypothesis(
  id: 'cluster' | 'software' | 'network',
  state: 'pending' | 'none' | 'mixed' | 'observed' | 'context' | 'unavailable',
  status: string,
  value: string,
) {
  const card = q(`[data-hypothesis="${id}"]`);
  if (!card) return;
  card.setAttribute('data-state', state);
  const statusEl = q('[data-field="status"]', card);
  const valueEl = q('[data-field="value"]', card);
  if (statusEl) statusEl.textContent = status;
  if (valueEl) valueEl.textContent = value;
}

function resetHypotheses() {
  for (const id of ['cluster', 'software', 'network'] as const) {
    setHypothesis(id, 'pending', t('hypotheses.pending'), '—');
  }
}

function resetUI() {
  setRing(0);
  const gauge = q('#score-gauge');
  gauge?.removeAttribute('data-band');
  gauge?.setAttribute('data-scanning', 'true');

  const badge = q('#risk-badge');
  if (badge) {
    badge.textContent = `${t('scan.detecting')}…`;
    badge.removeAttribute('data-band');
  }
  const desc = q('#risk-desc');
  if (desc) desc.textContent = t('hero.notice');

  q('#result')?.setAttribute('hidden', '');
  q('#share')?.setAttribute('hidden', '');
  q('#share-save')?.setAttribute('hidden', '');
  cardBlob = null;
  resetHypotheses();

  for (const signal of SIGNALS) {
    const row = q(`[data-signal="${signal.id}"]`);
    if (!row) continue;
    row.classList.remove('is-active', 'is-done');
    row.classList.add('is-pending');
    row.removeAttribute('data-verdict');
    const value = q('[data-field="value"]', row);
    const contribution = q('[data-field="contribution"]', row);
    const dot = q('[data-field="dot"]', row);
    if (value) value.textContent = '';
    if (contribution) contribution.textContent = '';
    if (dot) dot.className = 'dot';
  }
}

function finalize(total: number, hits: Hit[]) {
  const band = riskBand(total);
  const gauge = q('#score-gauge');
  gauge?.setAttribute('data-scanning', 'false');
  gauge?.setAttribute('data-band', band);

  const badge = q('#risk-badge');
  if (badge) {
    badge.textContent = t(`band.${band}.title`);
    badge.setAttribute('data-band', band);
  }
  const desc = q('#risk-desc');
  if (desc) desc.textContent = t(`band.${band}.desc`);

  const title = q('#result-title');
  const hitsBox = q('#result-hits');
  if (hitsBox) hitsBox.innerHTML = '';

  if (hits.length === 0) {
    if (title) title.textContent = t('result.noHits');
  } else {
    if (title) title.textContent = t('result.hitsTitle');
    for (const { signal, contribution } of hits) {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.setAttribute('data-verdict', signalVerdict(contribution / signal.weight));
      chip.innerHTML =
        `<span class="chip__icon">${signal.icon}</span>` +
        `<span>${t(`signal.${signal.id}.name`)}</span>` +
        `<b>+${contribution}</b>`;
      hitsBox?.appendChild(chip);
    }
  }

  const cardHits: CardHit[] = hits.map(({ signal, contribution }) => ({
    name: t(`signal.${signal.id}.name`),
    contribution,
    verdict: signalVerdict(contribution / signal.weight),
  }));

  updateShare(total, band);
  void buildCard(total, band, cardHits);
  q('#result')?.removeAttribute('hidden');
}

function matchedNames(readings: Map<SignalId, DetectOutcome>, ids: SignalId[]): string[] {
  return ids
    .filter((id) => (readings.get(id)?.score ?? 0) >= 0.25)
    .map((id) => t(`signal.${id}.name`));
}

function summarizeHypotheses(readings: Map<SignalId, DetectOutcome>) {
  const cluster = matchedNames(readings, ['timezone', 'language', 'intlLocale', 'timezoneOffset']);
  const clusterState = cluster.length >= 3 ? 'observed' : cluster.length > 0 ? 'mixed' : 'none';
  setHypothesis(
    'cluster',
    clusterState,
    t(`hypotheses.${clusterState}`),
    cluster.length ? cluster.join(' · ') : t('hypotheses.none'),
  );

  const software = matchedNames(readings, ['fonts', 'vendorFonts', 'cnBrowser', 'deviceVendor']);
  const softwareState = software.length >= 2 ? 'observed' : software.length > 0 ? 'mixed' : 'none';
  setHypothesis(
    'software',
    softwareState,
    t(`hypotheses.${softwareState}`),
    software.length ? software.join(' · ') : t('hypotheses.none'),
  );
}

async function fetchEdgeContext(): Promise<EdgeContext | null> {
  try {
    const response = await fetch(`/api/check?format=json&lang=${currentLang()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      credentials: 'same-origin',
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { geo?: Partial<EdgeContext> };
    return {
      country: data.geo?.country ?? null,
      timezone: data.geo?.timezone ?? null,
      asn: typeof data.geo?.asn === 'number' ? data.geo.asn : null,
      asOrganization: data.geo?.asOrganization ?? null,
    };
  } catch {
    return null;
  }
}

function summarizeEdgeContext(edge: EdgeContext | null, readings: Map<SignalId, DetectOutcome>) {
  if (!edge) {
    setHypothesis('network', 'unavailable', t('hypotheses.unavailable'), t('hypotheses.unavailable'));
    return;
  }

  const parts = [edge.country, edge.timezone];
  if (edge.asn) parts.push(`AS${edge.asn}`);
  if (edge.asOrganization) parts.push(edge.asOrganization);

  const localTimezone = readings.get('timezone')?.raw;
  const mismatch = Boolean(localTimezone && edge.timezone && localTimezone !== edge.timezone);
  if (localTimezone && edge.timezone) {
    parts.push(mismatch ? t('network.timezoneDiff') : t('network.timezoneMatch'));
  }

  const focusStatus = ['CN', 'HK', 'MO'].includes(edge.country ?? '')
    ? t('network.unlistedFocus')
    : edge.country === 'TW'
      ? t('network.listedTaiwan')
      : t('network.verifyList');
  parts.push(focusStatus);

  setHypothesis(
    'network',
    mismatch ? 'mixed' : 'context',
    mismatch ? t('hypotheses.mixed') : t('hypotheses.context'),
    parts.filter(Boolean).join(' · '),
  );
}

interface SharePayload {
  text: string;
  url: string;
}

type ShareData = { title?: string; text?: string; url?: string; files?: File[] };
const nav = navigator as Navigator & {
  share?: (data: ShareData) => Promise<void>;
  canShare?: (data: ShareData) => boolean;
};

const CARD_FILENAME = 'qim-environment-signal-result.png';
let cardBlob: Blob | null = null;
let sharePayload: SharePayload = { text: '', url: '' };

function pageShareUrl(): string {
  const url = new URL(window.location.href);
  url.hash = '';
  url.search = '';
  return url.toString();
}

async function buildCard(total: number, band: RiskBand, hits: CardHit[]) {
  try {
    cardBlob = await renderResultCard({
      lang: currentLang(),
      title: t('score.label'),
      score: total,
      band,
      bandTitle: t(`band.${band}.title`),
      bandDesc: t(`band.${band}.desc`),
      outOf: t('hero.scoreOutOf'),
      hits,
      url: pageShareUrl(),
      brand: 'QIM Developer Signal Lab',
    });
    if (cardBlob) q('#share-save')?.removeAttribute('hidden');
  } catch {
    cardBlob = null;
  }
}

function updateShare(total: number, band: RiskBand) {
  sharePayload = {
    text: t('share.text')
      .replace('{score}', String(total))
      .replace('{verdict}', t(`band.${band}.title`)),
    url: pageShareUrl(),
  };
  if (typeof nav.share === 'function') q('#share-native')?.removeAttribute('hidden');
  q('#share')?.removeAttribute('hidden');
}

async function copyText(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // The HTTPS production origin normally exposes the Clipboard API.
  }
  return false;
}

function flashCopied(button: HTMLElement, label: Element | null, idle: string, flash = t('share.copied')) {
  button.classList.add('is-copied');
  if (label) label.textContent = flash;
  window.setTimeout(() => {
    button.classList.remove('is-copied');
    if (label) label.textContent = idle;
  }, 1500);
}

async function nativeShare() {
  if (typeof nav.share !== 'function') return;
  const file = cardBlob ? new File([cardBlob], CARD_FILENAME, { type: 'image/png' }) : null;
  try {
    if (file && nav.canShare?.({ files: [file] })) {
      await nav.share({ text: sharePayload.text, url: sharePayload.url, files: [file] });
    } else {
      await nav.share({ text: sharePayload.text, url: sharePayload.url });
    }
  } catch {
    // Dismissal is not an application error.
  }
}

function saveImage() {
  if (!cardBlob) return;
  const url = URL.createObjectURL(cardBlob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = CARD_FILENAME;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function initShare() {
  q('#share-native')?.addEventListener('click', () => void nativeShare());

  const copy = q<HTMLButtonElement>('#share-copy');
  const copyLabel = q('#share-copy-label');
  const copyIdle = copyLabel?.textContent ?? t('share.copy');
  copy?.addEventListener('click', async () => {
    const value = `${sharePayload.text} ${sharePayload.url}`.trim();
    if (await copyText(value)) flashCopied(copy, copyLabel, copyIdle);
  });

  const save = q<HTMLButtonElement>('#share-save');
  const saveLabel = q('#share-save-label');
  const saveIdle = saveLabel?.textContent ?? t('share.save');
  save?.addEventListener('click', () => {
    saveImage();
    flashCopied(save, saveLabel, saveIdle, t('share.saved'));
  });
}

function initLangMemory() {
  for (const link of document.querySelectorAll<HTMLAnchorElement>('.lang-toggle a[data-lang]')) {
    link.addEventListener('click', () => {
      try {
        localStorage.setItem('fc-lang', link.dataset.lang || '');
      } catch {
        // Language navigation still works without storage.
      }
    });
  }
}

function initApiCopy() {
  const button = q<HTMLButtonElement>('#api-copy');
  const label = q('#api-copy-label');
  const idle = label?.textContent ?? t('share.copy');
  button?.addEventListener('click', async () => {
    const value = button.dataset.copy?.trim() ?? '';
    if (value && (await copyText(value))) flashCopied(button, label, idle);
  });
}

let running = false;

async function run() {
  if (running) return;
  running = true;
  const button = q<HTMLButtonElement>('#retest');
  const advanced = q<HTMLInputElement>('#advanced-optin')?.checked ?? false;
  if (button) button.disabled = true;
  resetUI();
  await delay(SETTLE_MS);

  const edgePromise = fetchEdgeContext();
  const readings = new Map<SignalId, DetectOutcome>();
  const hits: Hit[] = [];
  let total = 0;

  for (const signal of SIGNALS) {
    const row = q(`[data-signal="${signal.id}"]`);
    row?.classList.remove('is-pending');
    row?.classList.add('is-active');
    await delay(SCAN_STEP_MS);

    let outcome: DetectOutcome;
    if (signal.intrusive && !advanced) {
      outcome = { raw: t('advanced.skipped'), score: 0 };
    } else {
      try {
        outcome = await signal.detect();
      } catch {
        outcome = { raw: '—', score: 0 };
      }
    }

    readings.set(signal.id, outcome);
    const contribution = Math.round(outcome.score * signal.weight);
    const verdict = signalVerdict(outcome.score);
    total += contribution;

    if (row) {
      const value = q('[data-field="value"]', row);
      const contributionEl = q('[data-field="contribution"]', row);
      const dot = q('[data-field="dot"]', row);
      if (value) value.textContent = outcome.raw;
      if (contributionEl) {
        contributionEl.textContent = signal.weight > 0 ? `+${contribution}` : t('ui.contextOnly');
      }
      if (dot) dot.className = `dot dot--${verdict}`;
      row.classList.remove('is-active');
      row.classList.add('is-done');
      row.setAttribute('data-verdict', verdict);
    }

    setRing(Math.min(100, total));
    if (signal.weight > 0 && verdict !== 'low') hits.push({ signal, contribution });
    await delay(SETTLE_MS);
  }

  summarizeHypotheses(readings);
  summarizeEdgeContext(await edgePromise, readings);
  finalize(Math.min(100, total), hits);

  const label = q('#retest-label');
  if (label) label.textContent = t('ui.retest');
  if (button) button.disabled = false;
  running = false;
}

function init() {
  q('#retest')?.addEventListener('click', () => void run());
  initShare();
  initApiCopy();
  initLangMemory();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
