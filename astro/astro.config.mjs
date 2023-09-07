import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import prefetch from '@astrojs/prefetch';

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  },
  integrations: [tailwind({
    config: {
      applyBaseStyles: false
    }
  }), prefetch({
    selector: 'a'
  }), sitemap(), react()]
});