import type { Product } from '~/features/products/types/product';
import { getMockProducts } from '~/mocks';
import { debounce } from '~/features/shared/utils';

const RECENT_SEARCHES_KEY = 'guh-store-recent-searches';
const MAX_RECENT_SEARCHES = 5;
const MAX_SUGGESTIONS = 6;

export function useProductSearch() {
  const searchQuery = ref('');
  const suggestions = ref<Product[]>([]);
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

  function searchProducts(query: string): Product[] {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase().trim();
    const allProducts = getMockProducts();

    return allProducts
      .filter((product) => {
        const nameMatch = product.name.toLowerCase().includes(searchTerm);
        const descMatch = product.short_description?.toLowerCase().includes(searchTerm);
        return nameMatch || descMatch;
      })
      .slice(0, MAX_SUGGESTIONS);
  }

  const debouncedSearch = debounce((query: string) => {
    suggestions.value = searchProducts(query);
    isLoading.value = false;
  }, 200);

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

  function selectSuggestion(product: Product) {
    saveRecentSearch(product.name);
    closeSearch();
    navigateTo(`/products/${product.slug}`);
  }

  function submitSearch(query?: string) {
    const term = query || searchQuery.value;
    if (!term.trim()) return;
    saveRecentSearch(term);
    closeSearch();
    navigateTo(`/products?search=${encodeURIComponent(term.trim())}`);
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
    selectSuggestion,
    submitSearch,
    selectRecentSearch,
    clearRecentSearches,
    removeRecentSearch,
  };
}
