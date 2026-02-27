import { defineStore } from 'pinia';
import type { Category, CategoriesResponse, PaginationMeta } from './types';

export const useCategoriesStore = defineStore('categories', () => {
  const { shopSlug } = useShopInfo();
  const { posFetch } = useShopApi();

  const categories = ref<Category[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const meta = ref<PaginationMeta | null>(null);

  const hasCategories = computed(() => categories.value.length > 0);
  const totalCategories = computed(() => meta.value?.total || 0);
  const currentPage = computed(() => meta.value?.current_page || 1);
  const lastPage = computed(() => meta.value?.last_page || 1);
  const hasMorePages = computed(() => currentPage.value < lastPage.value);

  async function fetchCategories(page = 1): Promise<void> {
    if (!shopSlug.value) {
      error.value = 'Shop slug is not configured';
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await posFetch<CategoriesResponse>(
        '/api/third-party/v1/shops/analytic-hub',
        {
          method: 'POST',
          query: { page },
          body: {
            wallet_shop_slug: shopSlug.value,
            analytic_type: 'ListWalletShopProductTypeSearchHandler',
          },
        },
      );

      if (page === 1) {
        categories.value = response.data;
      } else {
        categories.value = [...categories.value, ...response.data];
      }
      meta.value = response.meta;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch categories';
    } finally {
      isLoading.value = false;
    }
  }

  async function loadMore(): Promise<void> {
    if (hasMorePages.value && !isLoading.value) {
      await fetchCategories(currentPage.value + 1);
    }
  }

  function reset(): void {
    categories.value = [];
    meta.value = null;
    error.value = null;
  }

  function getCategoryById(id: number): Category | undefined {
    return categories.value.find((c) => c.id === id);
  }

  return {
    categories,
    isLoading,
    error,
    meta,
    hasCategories,
    totalCategories,
    currentPage,
    lastPage,
    hasMorePages,
    fetchCategories,
    loadMore,
    reset,
    getCategoryById,
  };
});
