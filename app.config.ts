export default defineAppConfig({
  shopInfo: {},

  store: {
    name: process.env.SHOP_NAME || 'Store Name',
    slug: process.env.SHOP_SLUG || '',
    tagline: 'Your Store Tagline',
    description:
      'Discover amazing products at great prices. Shop our curated collection of quality items.',
    keywords: ['online store', 'shop', 'ecommerce', 'products'],
    logo: '/logo.png',
    favicon: '/favicon.ico',
    contact: {
      email: 'contact@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Store Street, City, Country',
    },
    social: {
      twitter: '@storename',
      facebook: 'storename',
      instagram: 'storename',
    },
  },

  seo: {
    titleTemplate: `%s | ${process.env.SHOP_NAME || 'Store Name'}`,
    defaultImage: '/og-image.png',
    twitterCard: 'summary_large_image',
  },

  ui: {
    primary: 'primary',
    neutral: 'zinc',
    button: {
      defaultVariants: {
        size: 'md',
        color: 'primary',
        variant: 'solid',
      },
    },
    input: {
      defaultVariants: {
        size: 'md',
        color: 'primary',
        variant: 'outline',
      },
    },
    card: {
      defaultVariants: {
        variant: 'outline',
      },
    },
  },
});
