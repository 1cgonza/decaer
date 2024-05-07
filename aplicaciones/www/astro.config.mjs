import { defineConfig } from 'astro/config';

export default defineConfig({
  publicDir: './estaticos',
  compressHTML: true,
  outDir: './publico',
  site: 'https://decaer.juancgonzalez.com',
  base: '/',
  srcDir: './fuente',
  build: {
    assets: 'estaticos',
  },
  server: {
    port: 3000,
  },
});
