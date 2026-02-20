import type { SeoOptions, ProductSeoData, CategorySeoData } from '../types/seo.types';

export function useSeo(options: SeoOptions = {}) {
  const appConfig = useAppConfig();
  const route = useRoute();
  const runtimeConfig = useRuntimeConfig();

  const store = (appConfig.store ?? {}) as {
    name?: string;
    description?: string;
    keywords?: string[];
    social?: { twitter?: string };
  };
  const seoConfig = (appConfig.seo ?? {}) as {
    titleTemplate?: string;
    defaultImage?: string;
    twitterCard?: string;
  };

  const storeName = store.name || 'Store';
  const storeDescription = store.description || '';
  const storeKeywords = store.keywords || [];
  const titleTemplate = seoConfig.titleTemplate || '%s | Store';
  const defaultImage = seoConfig.defaultImage || '/og-image.png';
  const twitterCard = seoConfig.twitterCard || 'summary_large_image';

  const siteUrl = (runtimeConfig.public.siteUrl as string) || '';
  const pageUrl = options.url || `${siteUrl}${route.path}`;
  const pageImage = options.image || `${siteUrl}${defaultImage}`;

  const keywords = [...storeKeywords, ...(options.keywords || [])];

  useSeoMeta({
    title: options.title,
    description: options.description || storeDescription,
    keywords: keywords.join(', '),
    ogTitle: options.title || storeName,
    ogDescription: options.description || storeDescription,
    ogImage: pageImage,
    ogUrl: pageUrl,
    ogType: options.type || 'website',
    ogSiteName: storeName,
    twitterCard: twitterCard as 'summary_large_image',
    twitterTitle: options.title || storeName,
    twitterDescription: options.description || storeDescription,
    twitterImage: pageImage,
    twitterSite: store.social?.twitter,
    robots: options.noIndex ? 'noindex, nofollow' : 'index, follow',
  });

  useHead({
    titleTemplate: (title) => {
      return title ? titleTemplate.replace('%s', title) : storeName;
    },
  });

  if (options.product) {
    useSchemaOrg([
      defineProduct({
        name: options.product.name,
        description: options.product.description || options.description,
        image: options.product.image || pageImage,
        sku: options.product.sku,
        brand: options.product.brand
          ? { '@type': 'Brand', name: options.product.brand }
          : undefined,
        offers: {
          '@type': 'Offer',
          price: options.product.price,
          priceCurrency: options.product.currency || 'USD',
          availability: `https://schema.org/${options.product.availability || 'InStock'}`,
        },
      }),
    ]);
  }
}

export function useProductSeo(product: ProductSeoData) {
  useSeo({
    title: product.name,
    description: product.description,
    image: product.image,
    type: 'website',
    product: {
      name: product.name,
      description: product.description,
      price: product.price,
      currency: product.currency,
      image: product.image,
      sku: product.sku,
      brand: product.brand,
      availability: product.availability,
    },
  });
}

export function useCategorySeo(category: CategorySeoData) {
  const appConfig = useAppConfig();
  const store = (appConfig.store ?? {}) as {
    name?: string;
    description?: string;
  };
  const storeName = store.name || 'Store';
  const storeDescription = store.description || '';

  useSeo({
    title: category.name,
    description:
      category.description ||
      `Shop ${category.name} at ${storeName}. ${storeDescription}`,
    image: category.image,
    keywords: [category.name.toLowerCase()],
  });
}
