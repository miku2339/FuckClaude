import assert from 'node:assert/strict';
import { redirectToPrimary } from '../src/legacy-redirect.mjs';

const cases = [
  ['https://fuckclaude.qimake.com/', 'https://signals.qimake.com/'],
  ['https://fuckclaude.qimake.com/zh/', 'https://signals.qimake.com/zh/'],
  [
    'https://fuckclaude.qimake.com/api/check?format=json&lang=zh',
    'https://signals.qimake.com/api/check?format=json&lang=zh',
  ],
];

for (const [source, expected] of cases) {
  const response = redirectToPrimary(new Request(source));
  assert.equal(response.status, 308);
  assert.equal(response.headers.get('location'), expected);
  assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
  assert.match(response.headers.get('cache-control') ?? '', /max-age=3600/);
}

console.log(`legacy redirect: ${cases.length} cases passed`);
