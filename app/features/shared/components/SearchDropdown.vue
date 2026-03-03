<script setup lang="ts">
import type { Product } from '~/features/products/types/product';
import { formatCurrency, type CurrencyCode } from '~/features/shared/utils';

interface Props {
  suggestions: Product[];
  isLoading: boolean;
  query: string;
}

defineProps<Props>();

const emit = defineEmits<{
  selectProduct: [product: Product];
  submit: [query: string];
}>();

const placeholderImage = 'https://placehold.co/80x80/f3f6f8/7493b2?text=No+Image';

function highlightMatch(text: string, query: string): string {
  if (!query.trim()) return text;
  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(
    regex,
    '<mark class="bg-primary/20 text-primary font-semibold px-0.5 rounded">$1</mark>'
  );
}
</script>

<template>
  <div
    class="absolute top-full right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
  >
    <div v-if="isLoading" class="flex items-center justify-center py-8">
      <div class="flex items-center gap-2 text-gray-400">
        <UIcon name="i-lucide-loader-2" class="size-5 animate-spin" />
        <span class="text-sm">Searching...</span>
      </div>
    </div>

    <template v-else>
      <div v-if="query.trim() && suggestions.length > 0">
        <div class="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Products</span>
        </div>
        <div class="max-h-80 overflow-y-auto">
          <button
            v-for="product in suggestions"
            :key="product.id"
            type="button"
            class="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0 group"
            @click="emit('selectProduct', product)"
          >
            <div
              class="size-14 rounded-lg overflow-hidden bg-gray-100 shrink-0 ring-1 ring-gray-200"
            >
              <NuxtImg
                :src="product.image || placeholderImage"
                :alt="product.name"
                class="size-full object-cover"
                loading="lazy"
              />
            </div>
            <div class="flex-1 min-w-0 text-left">
              <!-- eslint-disable vue/no-v-html -->
              <p
                class="text-sm font-medium text-gray-900 line-clamp-1"
                v-html="highlightMatch(product.name, query)"
              />
              <!-- eslint-enable vue/no-v-html -->
              <div class="flex items-center gap-2 mt-1">
                <span class="text-sm font-bold text-primary">
                  {{ formatCurrency(product.price, product.currency as CurrencyCode) }}
                </span>
                <span
                  v-if="product.is_sold"
                  class="text-[10px] font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded"
                >
                  Sold Out
                </span>
              </div>
            </div>
            <div
              class="shrink-0 p-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 group-hover:bg-primary/50 transition-colors"
            >
              <UIcon name="i-lucide-chevron-right" class="size-4 text-gray-400" />
            </div>
          </button>
        </div>

        <button
          type="button"
          class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors border-t border-gray-100"
          @click="emit('submit', query)"
        >
          <UIcon name="i-lucide-search" class="size-4 text-primary" />
          <span class="text-sm font-medium text-gray-700">
            View all results for "
            <span class="text-primary">{{ query }}</span>
            "
          </span>
        </button>
      </div>

      <div v-else-if="query.trim() && suggestions.length === 0" class="py-10 px-4 text-center">
        <div class="size-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
          <UIcon name="i-lucide-package-search" class="size-8 text-gray-400" />
        </div>
        <p class="text-sm font-medium text-gray-900">No products found</p>
        <p class="text-xs text-gray-500 mt-1">Try a different search term</p>
        <button
          type="button"
          class="mt-4 inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium cursor-pointer"
          @click="emit('submit', query)"
        >
          <UIcon name="i-lucide-search" class="size-4" />
          Search for "{{ query }}"
        </button>
      </div>

      <div v-else class="py-10 px-4 text-center">
        <div class="size-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
          <UIcon name="i-lucide-search" class="size-8 text-gray-400" />
        </div>
        <p class="text-sm font-medium text-gray-700">Search products</p>
        <p class="text-xs text-gray-500 mt-1">Type to find what you're looking for</p>
      </div>
    </template>
  </div>
</template>
