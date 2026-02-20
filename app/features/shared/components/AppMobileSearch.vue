<script setup lang="ts">
import { useProductSearch } from '~/features/products/composables/useProductSearch';
import { formatCurrency, type CurrencyCode } from '~/features/shared/utils';

interface Props {
  open: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const {
  searchQuery,
  suggestions,
  recentSearches,
  isLoading,
  handleInput,
  selectSuggestion,
  submitSearch,
  selectRecentSearch,
  clearRecentSearches,
  removeRecentSearch,
  clearSearch,
} = useProductSearch();

const searchInputRef = ref<HTMLInputElement | null>(null);

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
});

function closeSearch() {
  isOpen.value = false;
}

function handleSearchInput(event: Event) {
  const target = event.target as HTMLInputElement;
  handleInput(target.value);
}

function handleSearchSubmit() {
  if (searchQuery.value.trim()) {
    submitSearch();
    closeSearch();
  }
}

function handleSelectSuggestion(product: { slug: string }) {
  selectSuggestion(product);
  closeSearch();
}

function handleSelectRecent(query: string) {
  selectRecentSearch(query);
  closeSearch();
}

function handleClearInput() {
  clearSearch();
  searchInputRef.value?.focus();
}

watch(isOpen, (open) => {
  if (open) {
    nextTick(() => {
      searchInputRef.value?.focus();
    });
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex h-[100dvh] min-h-screen flex-col bg-white sm:hidden"
      >
                <div class="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
          <button
            type="button"
            class="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close search"
            @click="closeSearch"
          >
            <UIcon name="i-lucide-arrow-left" class="size-5" />
          </button>

          <div class="relative flex-1">
            <input
              ref="searchInputRef"
              :value="searchQuery"
              type="text"
              placeholder="Search products..."
              class="h-10 w-full rounded-full border border-gray-200 bg-gray-50 pl-10 pr-10 text-sm transition-colors focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              enterkeyhint="search"
              @input="handleSearchInput"
              @keyup.enter="handleSearchSubmit"
            />
            <UIcon
              name="i-lucide-search"
              class="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400"
            />
            <button
              v-if="searchQuery"
              type="button"
              class="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
              aria-label="Clear search"
              @click="handleClearInput"
            >
              <UIcon name="i-lucide-x" class="size-3.5" />
            </button>
          </div>
        </div>

                <div class="flex-1 overflow-y-auto">
                    <div v-if="isLoading" class="flex items-center justify-center py-12">
            <UIcon name="i-lucide-loader-2" class="size-6 animate-spin text-gray-400" />
          </div>

                    <div v-else-if="suggestions.length > 0" class="py-2">
            <p class="px-4 pb-2 text-xs font-medium text-gray-500">Products</p>
            <button
              v-for="product in suggestions"
              :key="product.id"
              type="button"
              class="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors active:bg-gray-50"
              @click="handleSelectSuggestion(product)"
            >
              <NuxtImg
                :src="product.image || 'https://placehold.co/56x56/f3f6f8/7493b2?text=?'"
                :alt="product.name"
                class="size-14 shrink-0 rounded-lg bg-gray-100 object-cover"
                loading="lazy"
              />
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-gray-900">
                  {{ product.name }}
                </p>
                <p class="mt-0.5 text-sm font-semibold text-primary">
                  {{ formatCurrency(product.price, product.currency as CurrencyCode) }}
                </p>
              </div>
              <UIcon name="i-lucide-chevron-right" class="size-4 shrink-0 text-gray-300" />
            </button>
          </div>

                    <div v-else-if="recentSearches.length > 0 && !searchQuery" class="py-2">
            <div class="flex items-center justify-between px-4 pb-2">
              <p class="text-xs font-medium text-gray-500">Recent searches</p>
              <button
                type="button"
                class="cursor-pointer text-xs font-medium text-primary hover:text-primary/80"
                @click="clearRecentSearches"
              >
                Clear all
              </button>
            </div>
            <button
              v-for="recent in recentSearches"
              :key="recent"
              type="button"
              class="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left transition-colors active:bg-gray-50"
              @click="handleSelectRecent(recent)"
            >
              <div class="flex items-center gap-3">
                <div class="flex size-9 items-center justify-center rounded-full bg-gray-100">
                  <UIcon name="i-lucide-clock" class="size-4 text-gray-400" />
                </div>
                <span class="text-sm text-gray-700">{{ recent }}</span>
              </div>
              <button
                type="button"
                class="flex size-8 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                aria-label="Remove search"
                @click.stop="removeRecentSearch(recent)"
              >
                <UIcon name="i-lucide-x" class="size-4" />
              </button>
            </button>
          </div>

                    <div
            v-else-if="!searchQuery"
            class="flex flex-col items-center justify-center px-6 py-16 text-center"
          >
            <div class="flex size-16 items-center justify-center rounded-full bg-gray-100">
              <UIcon name="i-lucide-search" class="size-7 text-gray-400" />
            </div>
            <p class="mt-4 text-sm font-medium text-gray-900">Search products</p>
            <p class="mt-1 text-sm text-gray-500">
              Find what you're looking for
            </p>
          </div>

                    <div
            v-else-if="searchQuery && !isLoading && suggestions.length === 0"
            class="flex flex-col items-center justify-center px-6 py-16 text-center"
          >
            <div class="flex size-16 items-center justify-center rounded-full bg-gray-100">
              <UIcon name="i-lucide-search-x" class="size-7 text-gray-400" />
            </div>
            <p class="mt-4 text-sm font-medium text-gray-900">No results found</p>
            <p class="mt-1 text-sm text-gray-500">
              Try searching with different keywords
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
