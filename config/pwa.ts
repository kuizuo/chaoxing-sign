import type { ModuleOptions } from '@vite-pwa/nuxt'

export const pwa: ModuleOptions = {
  registerType: 'autoUpdate',
  manifest: {
    name: '某星签到助手',
    short_name: '某星签到助手',
    theme_color: '#ffffff',
    icons: [
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
  },
  workbox: {
    navigateFallback: '/',
    globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
  },
  client: {
    installPrompt: true,
  },
  devOptions: {
    enabled: process.env.VITE_DEV_PWA === 'true',
    suppressWarnings: true,
    navigateFallbackAllowlist: [/^\/$/],
    type: 'module',
  },
}
