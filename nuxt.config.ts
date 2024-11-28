import { pwa } from './config/pwa'

export default defineNuxtConfig({
  app: {
    keepalive: true,
    head: {
      viewport: 'width=device-width,initial-scale=1,viewport-fit=cover',
      bodyAttrs: {
        class: 'overflow-x-hidden',
      },
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        // open graph social image
        { property: 'og:title', content: '某星签到助手' },
        { property: 'og:description', content: '摆脱客户端繁琐的签到流程，让签到不再是你的烦恼。' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '/chaoxing-og.png' },
        { property: 'og:image:width', content: '2000' },
        { property: 'og:image:height', content: '1000' },
        { property: 'og:site_name', content: '某星签到助手' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },
  runtimeConfig: {
    im: {
      initConnect: false,
    },
  },
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/content',
    ['@pinia/nuxt', {
      autoImports: ['defineStore', 'definePiniaStore'],
    }],
    '@pinia-plugin-persistedstate/nuxt',
    '@sidebase/nuxt-auth',
    '@huntersofbook/naive-ui-nuxt',
    'nuxt-icon',
    '@vite-pwa/nuxt',
    '@nuxt/devtools',
  ],
  imports: {
    dirs: [
      'composables/**/*',
      'stores/**/*',
    ],
  },
  components: [
    {
      path: '~/components/global',
      global: true,
    },
    {
      path: '~/components',
      extensions: ['vue'],
    },
  ],
  colorMode: {
    classSuffix: '',
  },
  unocss: {
    uno: true,
    icons: true,
    attributify: true,
    preflight: false,
  },
  css: ['~/assets/css/main.css'],
  content: {
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark',
        sepia: 'monokai',
      },
    },
  },
  routeRules: {
    '/help': { static: true },
    '/api/**': { cors: true },
    '/manifest.webmanifest': {
      headers: {
        'Content-Type': 'application/manifest+json',
        'Cache-Control': 'public, max-age=0, must-revalidate',
      },
    },
  },
  auth: {
    isEnabled: true,
    enableGlobalAppMiddleware: true,
    globalMiddlewareOptions: {
      allow404WithoutAuth: true,
      addDefaultCallbackUrl: true,
    },
  },
  build: {
    transpile: ['punycode'],
  },
  typescript: {
    shim: false,
  },
  pwa,
  experimental: {
    renderJsonPayloads: true,
    asyncContext: true,
  },
  devtools: {
    enabled: true,
    vscode: {},
  },
})
