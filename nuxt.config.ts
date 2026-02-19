export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxtjs/seo',
  ],

  css: ['~/assets/css/main.css'],

  components: [
    { path: '~/features/shared/components', pathPrefix: false },
    { path: '~/features/home/components', pathPrefix: false },
    { path: '~/features/cms/components', pathPrefix: false },
    { path: '~/features/cart/components', pathPrefix: false },
    { path: '~/features/products/components', pathPrefix: false },
  ],

  imports: {
    dirs: [
      'features/shared/composables',
      'features/shared/utils',
      'features/home/composables',
      'features/cms/composables',
      'features/cart/composables',
      'features/products/composables',
    ],
  },

  colorMode: {
    preference: 'light',
    fallback: 'light',
    disableTransition: true,
  },

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://example.com',
      apiBaseUrl:
        process.env.NUXT_PUBLIC_API_BASE_URL ||
        'https://test.pos.guhemba.com/api/third-party/v1/shops',
    },
  },

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://example.com',
    name: 'Store Name',
    description: 'Your store description goes here',
    defaultLocale: 'en',
  },

  ogImage: {
    enabled: true,
  },

  sitemap: {
    enabled: true,
    autoLastmod: true,
    xsl: false,
  },

  robots: {
    enabled: true,
  },

  schemaOrg: {
    enabled: true,
  },

  linkChecker: {
    enabled: false,
  },

  icon: {
    serverBundle: 'local',
    clientBundle: {
      scan: true,
    },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
});
