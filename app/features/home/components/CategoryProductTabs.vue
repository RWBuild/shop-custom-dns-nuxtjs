<script setup lang="ts">
import type { Product } from '~/features/products/types/product';
import type { Category } from '~/features/products/types/category';

export interface CategoryWithProducts extends Category {
  slug: string;
  products: Product[];
}

interface Props {
  categories: CategoryWithProducts[];
  allProducts: Product[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  addToCart: [product: Product];
}>();

const activeTab = ref('all');

const tabs = computed(() => [
  { label: 'All', slug: 'all' },
  ...props.categories.map((cat) => ({
    label: cat.name,
    slug: cat.slug,
  })),
]);

const activeProducts = computed(() => {
  if (activeTab.value === 'all') {
    return props.allProducts;
  }
  const category = props.categories.find((cat) => cat.slug === activeTab.value);
  return category?.products ?? [];
});

function handleAddToCart(product: Product) {
  emit('addToCart', product);
}
</script>

<template>
  <section>
    <div class="mb-4 border-b border-gray-300 sm:mb-6">
      <nav class="-mb-px flex overflow-x-auto scrollbar-hide">
        <button
          v-for="tab in tabs"
          :key="tab.slug"
          type="button"
          class="relative shrink-0 cursor-pointer px-3 py-2 text-xs font-medium transition-colors duration-200 sm:px-4 sm:py-2.5 sm:text-sm"
          :class="[
            activeTab === tab.slug
              ? 'text-primary'
              : 'text-gray-500 hover:text-gray-700',
          ]"
          @click="activeTab = tab.slug"
        >
          {{ tab.label }}
          <span
            class="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300 ease-out"
            :class="[
              activeTab === tab.slug ? 'bg-primary' : 'bg-transparent',
            ]"
          />
        </button>
      </nav>
    </div>

    <ProductGrid
      v-if="activeProducts.length > 0"
      :products="activeProducts"
      :columns="4"
      @add-to-cart="handleAddToCart"
    />
    <div
      v-else
      class="py-12 text-center sm:py-16"
    >
      <p class="text-xs text-gray-400 sm:text-sm">
        No products in this category yet.
      </p>
    </div>
  </section>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
