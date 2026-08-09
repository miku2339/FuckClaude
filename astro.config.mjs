// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// `site` must match the real deployment origin so canonical URLs,
// hreflang links and the generated sitemap point to the correct domain.
//
// Output stays `static` for every page except the single on-demand
// `/api/check` route, which runs at the Cloudflare edge.
export default defineConfig({
  site: 'https://signals.qimake.com',
  output: 'static',
  adapter: cloudflare(),
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          zh: 'zh-CN',
        },
      },
    }),
  ],
});
