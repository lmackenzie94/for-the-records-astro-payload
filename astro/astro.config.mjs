import prefetch from '@astrojs/prefetch';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://for-the-records.com',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  },
  image: {
    domains: ['payload', 'i.discogs.com']
  },
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false
      }
    }),
    prefetch({
      // selector: 'a' --> prefetch all links when visible
      intentSelector: 'a' // --> prefetch links on hover
    }),
    sitemap(),
    react()
  ]
});
