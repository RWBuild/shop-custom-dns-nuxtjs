export function useShopInfo() {
  const config = useRuntimeConfig();
  const appConfig = useAppConfig();

  const shopContent = computed(() => {
    return (config.public.shopInfo || appConfig.shopInfo || {}) as ShopContent;
  });

  const getImageByType = (type: 'logo' | 'banner') => {
    return computed(() => {
      const images = shopContent.value.images || [];
      return images.find((img) => img.type === type)?.full_url || '';
    });
  };

  return {
    shopContent,
    dns: computed(() => shopContent.value.dns || ''),
    shopInfo: computed(() => shopContent.value.shop_info || ({} as ShopInfo)),
    shopId: computed(() => shopContent.value.shop_info?.id),
    guhembaWalletId: computed(() => shopContent.value.shop_info?.guhemba_wallet_id),
    shopName: computed(() => shopContent.value.shop_info?.name || ''),
    shopSlug: computed(() => shopContent.value.shop_info?.slug || ''),
    shopCategory: computed(() => shopContent.value.shop_info?.category || ''),
    shopCurrency: computed(() => shopContent.value.shop_info?.currency || ''),
    shopSettings: computed(() => shopContent.value.shop_info?.settings || {}),
    isFashionMaker: computed(() => shopContent.value.shop_info?.is_fashion_maker || false),
    images: computed(() => shopContent.value.images || []),
    logoUrl: getImageByType('logo'),
    bannerUrl: getImageByType('banner'),
    about: computed(() => shopContent.value.about || ({} as ShopAbout)),
    shopAddress: computed(() => shopContent.value.about?.address || ''),
    shopLocation: computed(() => shopContent.value.about?.location || ''),
    shopEmail: computed(() => shopContent.value.about?.email || ''),
    shopPhone: computed(() => shopContent.value.about?.phone || ''),
    aboutContent: computed(() => shopContent.value.about?.about_content || ''),
    analyticKeys: computed(() => shopContent.value.analytic_keys || ({} as AnalyticKeys)),
  };
}

export interface ShopContent {
  dns?: string;
  shop_info?: ShopInfo;
  images?: ShopImage[];
  about?: ShopAbout;
  analytic_keys?: AnalyticKeys;
}

export interface ShopInfo {
  id?: number;
  user_id?: number;
  name?: string;
  category?: string;
  guhemba_wallet_id?: number;
  slug?: string;
  merchant_key?: string | null;
  created_at?: string;
  updated_at?: string;
  currency?: string;
  settings?: ShopSettings;
  is_fashion_maker?: boolean;
}

export interface ShopSettings {
  is_fashion_maker?: boolean;
  has_custom_domain?: boolean;
  [key: string]: unknown;
}

export interface ShopImage {
  id: number;
  imageable_type: string;
  imageable_id: number;
  path: string;
  full_url: string;
  type: 'logo' | 'banner' | string;
  created_at: string;
  updated_at: string;
}

export interface ShopAbout {
  id?: number;
  shop_id?: number;
  address?: string;
  about_content?: string;
  location?: string;
  email?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AnalyticKeys {
  ACTION_VIEW?: string;
  ACTION_ADD_TO_CART?: string;
  ACTION_CART_CREATED?: string;
  ACTION_CART_CHECKEDOUT?: string;
  ACTION_SEARCH?: string;
  ACTION_VISIT?: string;
  GROUP_PRODUCT_CATEGORY_TABS?: string;
  GROUP_PRODUCT_DETAIL_VIEW?: string;
  GROUP_PRODUCT_ADDED_TO_CART?: string;
  GROUP_PRODUCT_SEARCH?: string;
  GROUP_SHOP_PAGES?: string;
  GROUP_CART_MANAGEMENT?: string;
  PAGE_TAG_SHOP_DETAIL?: string;
  PAGE_TAG_SHOP_ABOUT?: string;
  PAGE_TAG_SHOP_CONTACT?: string;
  PAGE_TAG_SHOP_SEARCH?: string;
  PAGE_TAG_SHOP_PRODUCT_VISIT?: string;
  PAGE_TAG_LANDING_PAGE?: string;
  [key: string]: string | undefined;
}
