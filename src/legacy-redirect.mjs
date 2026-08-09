const PRIMARY_ORIGIN = 'https://signals.qimake.com';

export function redirectToPrimary(request) {
  const incoming = new URL(request.url);
  const target = new URL(`${incoming.pathname}${incoming.search}`, PRIMARY_ORIGIN);

  return new Response(null, {
    status: 308,
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'Content-Security-Policy': "default-src 'none'; base-uri 'none'; frame-ancestors 'none'",
      Location: target.href,
      'Referrer-Policy': 'no-referrer',
      'Strict-Transport-Security': 'max-age=31536000',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

export default {
  fetch: redirectToPrimary,
};
