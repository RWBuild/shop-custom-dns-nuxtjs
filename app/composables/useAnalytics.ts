import { addLog } from 'system-analytic-log';

const ACTION_VIEW = 'view';
const ACTION_ADD_TO_CART = 'add-to-cart';
const ACTION_CART_CREATED = 'cart-created';
const ACTION_CART_CHECKEDOUT = 'cart-checkedout';
const ACTION_SEARCH = 'search';
const ACTION_VISIT = 'Visit';

const GROUP_PRODUCT_CATEGORY_TABS = 'product-category-tabs';
const GROUP_PRODUCT_DETAIL_VIEW = 'product-detail-view';
const GROUP_PRODUCT_ADDED_TO_CART = 'product-added-to-cart';
const GROUP_PRODUCT_SEARCH = 'product search';
const GROUP_SHOP_PAGES = 'shop-pages';
const GROUP_CART_MANAGEMENT = 'cart-management';

type DuplicatePolicy = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year' | 'never' | 'every';

interface LogParams {
  tag: string;
  action: string;
  group: string;
  duplicate_after: DuplicatePolicy;
  payload?: Record<string, unknown>;
}

function log(params: LogParams) {
  if (!import.meta.client) return;

  const config = useRuntimeConfig();
  const { shopSlug } = useShopInfo();

  addLog({
    ...params,
    handler_type: 'all',
    tenant_id: shopSlug.value || (config.public.shopSlug as string),
  });
}

export function useAnalytics() {
  function trackPageView(pageName: string) {
    log({
      tag: pageName,
      action: ACTION_VISIT,
      group: GROUP_SHOP_PAGES,
      duplicate_after: 'day',
    });
  }

  function trackProductView(product: { name: string; id?: number | string }) {
    log({
      tag: product.name,
      action: ACTION_VIEW,
      group: GROUP_PRODUCT_DETAIL_VIEW,
      duplicate_after: 'day',
      payload: { product_id: product.id },
    });
  }

  function trackAddToCart(product: { name: string; id?: number | string; price?: number }) {
    log({
      tag: product.name,
      action: ACTION_ADD_TO_CART,
      group: GROUP_PRODUCT_ADDED_TO_CART,
      duplicate_after: 'every',
      payload: { product_id: product.id, price: product.price },
    });
  }

  function trackCategoryView(category: { name: string; id?: number | string }) {
    log({
      tag: category.name,
      action: ACTION_VIEW,
      group: GROUP_PRODUCT_CATEGORY_TABS,
      duplicate_after: 'day',
      payload: { category_id: category.id },
    });
  }

  function trackSearch(query: string) {
    log({
      tag: query,
      action: ACTION_SEARCH,
      group: GROUP_PRODUCT_SEARCH,
      duplicate_after: 'day',
    });
  }

  function trackCheckout(orderId?: string | number) {
    log({
      tag: orderId ? String(orderId) : 'checkout',
      action: ACTION_CART_CHECKEDOUT,
      group: GROUP_CART_MANAGEMENT,
      duplicate_after: 'every',
      payload: { order_id: orderId },
    });
  }

  function trackCartCreated() {
    log({
      tag: 'cart-created',
      action: ACTION_CART_CREATED,
      group: GROUP_CART_MANAGEMENT,
      duplicate_after: 'day',
    });
  }

  return {
    trackPageView,
    trackProductView,
    trackAddToCart,
    trackCategoryView,
    trackSearch,
    trackCheckout,
    trackCartCreated,
  };
}
