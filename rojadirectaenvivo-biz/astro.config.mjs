// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://rojadirectaenvivo.biz',
  output: 'static',
  build: {
    format: 'directory',
  },
  compressHTML: true,
});
