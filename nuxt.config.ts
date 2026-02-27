const fontFamily = process.env.FONT_FAMILY || 'Inter';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxtjs/seo',
    '@pinia/nuxt',
    '~/modules/shop-content',
  ],

  css: ['~/assets/css/main.css'],

  fonts: {
    provider: 'google',
    families: [
      {
        name: fontFamily,
        weights: [400, 500, 600, 700],
        styles: ['normal'],
        global: true,
      },
    ],
    defaults: {
      weights: [400, 500, 600, 700],
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `$font-family: '${fontFamily}';`,
        },
      },
    },
  },

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
      shopPublicToken: process.env.SHOP_PUBLIC_TOKEN || '',
      shopSecretKey: process.env.SHOP_SECRET_KEY || '',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://example.com',
      shopBaseUrl: process.env.GUHEMBA_SHOP_BASE_URL || 'https://shops.guhemba.rw',
      posBaseUrl: process.env.POS_BASE_URL || 'https://pos.guhemba.rw',
      shopName: process.env.SHOP_NAME || 'Store Name',
      shopSlug: process.env.SHOP_SLUG || '',
      shopId: process.env.SHOP_ID || '',
      fontFamily,
      primaryColor: process.env.LIGHT_THEME_COLOR || '#00a1de',
    },
  },

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://example.com',
    name: process.env.SHOP_NAME || 'Store Name',
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
