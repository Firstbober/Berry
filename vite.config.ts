import { defineConfig } from 'vite';

import solidPlugin from 'vite-plugin-solid';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa'
import { comlink } from 'vite-plugin-comlink'

// PWA options for VitePWA plugin
const pwaOptions: Partial<VitePWAOptions> = {
  mode: 'development',
  base: '/',
  includeAssets: ['/images/logos/logo-contained.svg'],
  manifest: {
    name: 'Berry',
    short_name: 'Berry',
    theme_color: '#F64A8A',
    id: 'io.github.firstbober.berrychat',
    display: 'standalone',
    icons: [
      {
        "src": "/images/logos/pwa-icons/logo-contained-128.png",
        "type": "image/png",
        "sizes": "128x128"
      },
      {
        "src": "/images/logos/pwa-icons/logo-contained-512.png",
        "type": "image/png",
        "sizes": "512x512"
      },
      {
        "src": "/images/logos/pwa-icons/logo-contained-1024.png",
        "type": "image/png",
        "sizes": "1024x1024"
      },
      {
        "src": "/images/logos/pwa-icons/logo-maskable-512.png",
        "type": "image/png",
        "sizes": "512x512",
        "purpose": "maskable"
      },
    ],
  },
  devOptions: {
    enabled: process.env.SW_DEV === 'true',
    /* when using generateSW the PWA plugin will switch to classic */
    type: 'module',
    navigateFallback: 'index.html',
  }
}

export default defineConfig({
  plugins: [
    solidPlugin(),
    VitePWA(pwaOptions),
    comlink()
  ],
  worker: {
    plugins: [
      comlink()
    ]
  },
  define: {
    BERRY_VERSION: JSON.stringify(process.env.npm_package_version)
  },
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
