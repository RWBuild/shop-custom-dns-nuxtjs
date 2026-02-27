import { defineStore } from 'pinia';
import type { Product, ProductListItem, ProductsResponse, PaginationMeta } from './types';

export const useProductsStore = defineStore('products', () => {
  const { shopSlug, guhembaWalletId } = useShopInfo();
  const { posFetch } = useShopApi();

  const products = ref<ProductListItem[]>([]);
  const currentProduct = ref<Product | null>(null);
  const isLoading = ref(false);
  const isLoadingProduct = ref(false);
  const error = ref<string | null>(null);
  const meta = ref<PaginationMeta | null>(null);
  const searchQuery = ref('');
  const selectedCategoryId = ref<number | null>(null);

  const hasProducts = computed(() => products.value.length > 0);
  const totalProducts = computed(() => meta.value?.total || 0);
  const currentPage = computed(() => meta.value?.current_page || 1);
  const lastPage = computed(() => meta.value?.last_page || 1);
  const hasMorePages = computed(() => currentPage.value < lastPage.value);

  function buildSearchValue(): Record<string, unknown> | undefined {
    const searchValue: Record<string, unknown> = {};

    if (searchQuery.value.trim()) {
      searchValue.search_product_name = searchQuery.value.trim();
    }

    if (selectedCategoryId.value) {
      searchValue.product_type_id = selectedCategoryId.value;
    }

    return Object.keys(searchValue).length > 0 ? searchValue : undefined;
  }

  async function fetchProducts(page = 1, append = false): Promise<void> {
    if (!shopSlug.value) {
      error.value = 'Shop slug is not configured';
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const body: Record<string, unknown> = {
        wallet_shop_slug: shopSlug.value,
        analytic_type: 'ListWalletShopProductSearchHandler',
      };

      const searchValue = buildSearchValue();
      if (searchValue) {
        body.search_value = searchValue;
      }

      const response = await posFetch<ProductsResponse>(
        '/api/third-party/v1/shops/analytic-hub',
        {
          method: 'POST',
          query: { page },
          body,
        },
      );

      if (append && page > 1) {
        products.value = [...products.value, ...response.data];
      } else {
        products.value = response.data;
      }
      meta.value = response.meta;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch products';
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchProductBySlug(productSlug: string): Promise<Product | null> {
    if (!guhembaWalletId.value) {
      error.value = 'Shop wallet ID is not configured';
      return null;
    }

    isLoadingProduct.value = true;
    error.value = null;

    try {
      const response = await posFetch<Product>(
        `/api/third-party/v1/shops/products/${guhembaWalletId.value}/${productSlug}`,
      );

      currentProduct.value = response;
      return response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch product';
      return null;
    } finally {
      isLoadingProduct.value = false;
    }
  }

  async function loadMore(): Promise<void> {
    if (hasMorePages.value && !isLoading.value) {
      await fetchProducts(currentPage.value + 1, true);
    }
  }

  async function search(query: string): Promise<void> {
    searchQuery.value = query;
    await fetchProducts(1);
  }

  async function filterByCategory(categoryId: number | null): Promise<void> {
    selectedCategoryId.value = categoryId;
    await fetchProducts(1);
  }

  function reset(): void {
    products.value = [];
    currentProduct.value = null;
    meta.value = null;
    error.value = null;
    searchQuery.value = '';
    selectedCategoryId.value = null;
  }

  function clearCurrentProduct(): void {
    currentProduct.value = null;
  }

  function getProductById(id: number): ProductListItem | undefined {
    return products.value.find((p) => p.id === id);
  }

  function getProductBySlug(slug: string): ProductListItem | undefined {
    return products.value.find((p) => p.slug === slug);
  }

  return {
    products,
    currentProduct,
    isLoading,
    isLoadingProduct,
    error,
    meta,
    searchQuery,
    selectedCategoryId,
    hasProducts,
    totalProducts,
    currentPage,
    lastPage,
    hasMorePages,
    fetchProducts,
    fetchProductBySlug,
    loadMore,
    search,
    filterByCategory,
    reset,
    clearCurrentProduct,
    getProductById,
    getProductBySlug,
  };
});
