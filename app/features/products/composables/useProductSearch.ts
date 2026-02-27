import type { ProductListItem } from '~/stores/types';
import { debounce } from '~/features/shared/utils';

const RECENT_SEARCHES_KEY = 'guh-store-recent-searches';
const MAX_RECENT_SEARCHES = 5;
const MAX_SUGGESTIONS = 6;

export function useProductSearch() {
  const { shopSlug } = useShopInfo();
  const { posFetch } = useShopApi();

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

  function saveRecentSearch(query: string) {
    if (!query.trim()) return;

    const trimmed = query.trim().toLowerCase();
    recentSearches.value = [
      trimmed,
      ...recentSearches.value.filter((s) => s !== trimmed),
    ].slice(0, MAX_RECENT_SEARCHES);

    if (import.meta.client) {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches.value));
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
        },
      );

      return response.data.slice(0, MAX_SUGGESTIONS);
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  }

  const debouncedSearch = debounce(async (query: string) => {
    suggestions.value = await searchProducts(query);
    isLoading.value = false;
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

  function selectSuggestion(product: ProductListItem) {
    saveRecentSearch(product.name);
    closeSearch();
    navigateTo(`/products/${product.slug}`);
  }

  function submitSearch(query?: string) {
    const term = query || searchQuery.value;
    if (!term.trim()) return;
    saveRecentSearch(term);
    closeSearch();
    // Navigate to home with search filter applied
    navigateTo(`/?search=${encodeURIComponent(term.trim())}`);
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
