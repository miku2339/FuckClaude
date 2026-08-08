# QIM Developer Signal Lab

QIM public-interest deployment of the open-source
[`LinXiaoTao/FuckClaude`](https://github.com/LinXiaoTao/FuckClaude) project:
<https://fuckclaude.qimake.com>.

The product identity is **QIM Developer Signal Lab**. Claude and Claude Code are
referenced only to identify the service being discussed. QIM is independent and
is not affiliated with, endorsed by, or sponsored by Anthropic.

## Purpose and evidence model

This free tool helps developers inspect environment signals and evaluate public
claims more critically. It separates three things that should not be conflated:

1. **Official policy and disclosed data categories** — Anthropic says it uses IP
   plus other signals for rough location and lists data categories including
   timezone, ISP/network, OS, browser, payment and identity information.
2. **Third-party reports** — retained for provenance, but never described as an
   Anthropic-confirmed implementation.
3. **QIM hypotheses** — transparent locale and cross-signal correlations that
   are experimental, separately labeled, and unable to predict account action.

Primary sources:

- [Anthropic location disclosure](https://privacy.claude.com/en/articles/11186740-does-claude-use-my-location)
- [Anthropic privacy policy](https://www.anthropic.com/legal/privacy)
- [Anthropic supported countries and regions](https://www.anthropic.com/supported-countries)
- [Claude Code data usage](https://code.claude.com/docs/en/data-usage)

No public source reveals Anthropic's complete signal mapping, weights, or
enforcement threshold. A result from this site is not an Anthropic decision,
account-eligibility conclusion, or guarantee against enforcement.

## QIM changes

- Replaced the hostile/ambiguous product presentation with current QIM branding
  and the canonical QIM logo used on `qimake.com`.
- Removed CEO/weapon mascots, ads, analytics, sponsors, affiliate surfaces,
  anti-detection guides, and evasion-oriented content from the deployed branch.
- Added a visible evidence ledger, public-interest statement, non-affiliation
  notice, privacy boundary, and bilingual use/liability terms.
- Moved `/api/check` to Cloudflare Workers and added read-only Cloudflare
  country, timezone, ASN, and network-organization context.
- Kept the weighted browser score local. Canvas font and WebRTC/STUN checks are
  optional, off by default, zero-weight, and disclosed before use.
- Added QIM hypotheses for cross-signal consistency, regional software context,
  and browser-versus-edge timezone mismatch. They never add points.
- Preserved MIT attribution and direct links to the upstream project.
- Added security headers and `no-transform` protection against automatic
  analytics injection.

## Privacy

The application has no login, cookies, analytics, advertising, or scan-result
storage. The local weighted values do not leave the browser. The edge-context
card makes a same-origin GET and displays IP-derived metadata Cloudflare already
processes while serving the site. Optional WebRTC testing may contact Google's
public STUN service; ICE candidates remain in the browser.

## Provenance

- QIM fork: <https://github.com/miku233333/FuckClaude>
- Upstream: <https://github.com/LinXiaoTao/FuckClaude>
- QIM base commit: `f94bcc66e4a390e6c2b747768678db0f95e7d786`
- Base archive SHA-256: `b4d8c85b7ca855b3179d422102c90e361be462b9b14e3ca2423b586ff9edc517`
- License: MIT, © LinXiaoTao; QIM modifications retain the original notice.

Upstream was checked through `3aa684afb17b588cfe61ba8506522bf3116cc2fe` on
2026-08-09. Its newer guide/sponsor changes were not merged because they do not
update the detector and conflict with this deployment's evidence and privacy
boundary.

## Local verification

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm build
pnpm exec wrangler deploy --dry-run -c wrangler.preview.jsonc
```

Requires Node `>=22.12.0` and pnpm `10.32.1`.

## Staged deployment

Build first, then deploy the preview Worker:

```bash
pnpm build
pnpm exec wrangler deploy -c wrangler.preview.jsonc
```

After browser, API, headers, and asset checks pass, deploy production using the
Astro-generated Cloudflare configuration:

```bash
pnpm exec wrangler deploy
```

## Use and responsibility

Provided "as is" for research and reference. QIM makes no promise of accuracy,
completeness, continuous availability, maintenance, support, updates, or fitness
for a particular purpose. Users must follow applicable law and service terms;
this tool does not provide or encourage bypassing regional, identity, or
security controls. To the maximum extent permitted by applicable law, QIM is
not liable for loss arising from use or reliance. Nothing excludes liability
that cannot legally be excluded.

## 中文摘要

這是 QIM 為開發者提供的公益環境訊號自查工具。官方政策、第三方報告與 QIM 假設分開
展示；結果不代表 Anthropic 的判斷，也不能預測帳號處置。網站不設登入、分析、廣告或
結果儲存；canvas 字體及 WebRTC 測試預設關閉、須主動啟用且不計分。工具按現狀提供，
不承諾維護、支援、持續可用或特定用途適用性，亦不提供繞過地區、身份或安全限制的方法。
