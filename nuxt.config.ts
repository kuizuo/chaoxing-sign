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
      'constants/**/*',
    ],
  },
  components: [
    {
      path: '~/components',
      extensions: ['vue'],
    },
  ],
  colorMode: {
    preference: 'system',
    fallback: 'dark',
    classSuffix: '',
  },
  unocss: {
    uno: true,
    icons: true,
    attributify: true,
    preflight: false,
  },
  content: {
    documentDriven: false,
    markdown: {
      mdc: true,
    },
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark',
        sepia: 'monokai',
      },
    },
  },
  routeRules: {
    '/changelog': { static: true },
    '/help': { static: true },
    '/api/**': { cors: true },
  },
  auth: {
    enableGlobalAppMiddleware: true,
    globalMiddlewareOptions: {
      allow404WithoutAuth: true,
    },
  },
  typescript: {
    shim: false,
  },
  build: {
    transpile: ['punycode', 'consola'],
  },
  devtools: {
    enabled: true,
    vscode: {},
  },
})
