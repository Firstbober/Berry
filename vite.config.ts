import { defineConfig } from 'vite';

import solidPlugin from 'vite-plugin-solid';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa'

const pwaOptions: Partial<VitePWAOptions> = {
  mode: 'development',
  base: '/',
  includeAssets: ['favicon.svg'],
  manifest: {
    name: 'Berry',
    short_name: 'Berry',
    theme_color: '#F64A8A',
    id: 'io.github.firstbober.berrychat',
    display: 'standalone',
    icons: [],
  },
  devOptions: {
    enabled: process.env.SW_DEV === 'true',
    /* when using generateSW the PWA plugin will switch to classic */
    type: 'module',
    navigateFallback: 'index.html',
  },
}

export default defineConfig({
  plugins: [
    solidPlugin(),
    VitePWA(pwaOptions)
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
