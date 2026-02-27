import { defineNuxtModule, useLogger } from '@nuxt/kit';
import { gunzipSync } from 'node:zlib';

export interface ShopContentOptions {
  contentUrl?: string;
}

export default defineNuxtModule<ShopContentOptions>({
  meta: {
    name: 'shop-content',
    configKey: 'shopContent',
  },
  defaults: {
    contentUrl: process.env.SHOP_CONTENT_FILE_PATH || '',
  },
  async setup(options, nuxt) {
    const logger = useLogger('shop-content');
    const contentUrl = options.contentUrl?.replace(/\\\//g, '/');

    if (!contentUrl) {
      logger.warn('SHOP_CONTENT_FILE_PATH not set, skipping shop content fetch');
      return;
    }

    logger.info(`Fetching shop content from: ${contentUrl}`);

    try {
      const shopInfo = await fetchAndExtractShopContent(contentUrl);

      // @ts-expect-error Dynamic content
      nuxt.options.runtimeConfig.public.shopInfo = shopInfo;
      // @ts-expect-error Dynamic content
      nuxt.options.appConfig.shopInfo = shopInfo;

      logger.success('Shop content loaded successfully');
    } catch (error) {
      logger.error('Failed to fetch shop content:', error);
      // @ts-expect-error Dynamic content
      nuxt.options.runtimeConfig.public.shopInfo = {};
      // @ts-expect-error Dynamic content
      nuxt.options.appConfig.shopInfo = {};
    }
  },
});

async function fetchAndExtractShopContent(url: string): Promise<Record<string, unknown>> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const decompressed = gunzipSync(buffer);
  const jsonString = decompressed.toString('utf-8');

  return JSON.parse(jsonString);
}
