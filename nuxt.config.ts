export default defineNuxtConfig({
  app: {
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
  experimental: {
    renderJsonPayloads: true,
  },
  devtools: {
    enabled: true,
    vscode: {},
  },
})
