import { debounce } from '~/features/shared/utils';
import type { ProductListItem } from '~/stores/types';

const RECENT_SEARCHES_KEY = 'guh-store-recent-searches';
const MAX_SUGGESTIONS = 6;

export function useProductSearch() {
  const { shopSlug } = useShopInfo();
  const { posFetch } = useShopApi();
  const { trackSearch } = useAnalytics();

  const searchQuery = ref('');
  const suggestions = ref<ProductListItem[]>([]);
  const recentSearches = ref<string[]>([]);
  const isLoading = ref(false);
  const isOpen = ref(false);

  function loadRecentSearches() {
    if (import.meta.client) {
      try {
        const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
        if (stored) {
          recentSearches.value = JSON.parse(stored);
        }
      } catch {
        recentSearches.value = [];
      }
    }
  }

  function clearRecentSearches() {
    recentSearches.value = [];
    if (import.meta.client) {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    }
  }

  function removeRecentSearch(query: string) {
    recentSearches.value = recentSearches.value.filter((s) => s !== query);
    if (import.meta.client) {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches.value));
    }
  }

  async function searchProducts(query: string): Promise<ProductListItem[]> {
    if (!query.trim() || !shopSlug.value) return [];

    try {
      const response = await posFetch<{ data: ProductListItem[] }>(
        '/api/third-party/v1/shops/analytic-hub',
        {
          method: 'POST',
          body: {
            wallet_shop_slug: shopSlug.value,
            analytic_type: 'ListWalletShopProductSearchHandler',
            search_value: {
              search_product_name: query.trim(),
            },
          },
        }
      );

      return response.data.slice(0, MAX_SUGGESTIONS);
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  }

  const debouncedTrackSearch = debounce((query: string, resultsCount: number) => {
    if (query.trim().length >= 2) {
      trackSearch(query.trim(), resultsCount);
    }
  }, 1500);

  const debouncedSearch = debounce(async (query: string) => {
    const results = await searchProducts(query);
    suggestions.value = results;
    isLoading.value = false;
    debouncedTrackSearch(query, results.length);
  }, 300);

  function handleInput(query: string) {
    searchQuery.value = query;
    if (query.trim()) {
      isLoading.value = true;
      debouncedSearch(query);
    } else {
      suggestions.value = [];
      isLoading.value = false;
    }
  }

  function openSearch() {
    isOpen.value = true;
    loadRecentSearches();
  }

  function closeSearch() {
    isOpen.value = false;
    searchQuery.value = '';
    suggestions.value = [];
  }

  function clearSearch() {
    searchQuery.value = '';
    suggestions.value = [];
  }

  async function selectSuggestion(product: ProductListItem) {
    closeSearch();
    await navigateTo(`/products/${product.slug}`);
  }

  async function submitSearch(query?: string) {
    const term = query || searchQuery.value;
    if (!term.trim()) return;
    closeSearch();
    await navigateTo(`/?search=${encodeURIComponent(term.trim())}`);
  }

  function selectRecentSearch(query: string) {
    searchQuery.value = query;
    handleInput(query);
  }

  onMounted(() => {
    loadRecentSearches();
  });

  return {
    searchQuery,
    suggestions,
    recentSearches,
    isLoading,
    isOpen,
    handleInput,
    openSearch,
    closeSearch,
    clearSearch,
    selectSuggestion,
    submitSearch,
    selectRecentSearch,
    clearRecentSearches,
    removeRecentSearch,
  };
}
