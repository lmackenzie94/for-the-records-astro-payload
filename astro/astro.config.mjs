import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import prefetch from '@astrojs/prefetch';
import preact from "@astrojs/preact";

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
  }), sitemap(), preact({
    // enable Preact’s compatibility layer for rendering React components without needing to install or ship React’s larger libraries to your users’ web browsers.
    // need this for react-icons to work
    compat: true
  })]
});