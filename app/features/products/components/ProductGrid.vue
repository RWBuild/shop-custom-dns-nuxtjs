<script setup lang="ts">
import type { Product, ProductListItem } from '~/features/products/types/product';

type ProductType = Product | ProductListItem;

interface Props {
  products: ProductType[];
  columns?: 2 | 3 | 4;
}

withDefaults(defineProps<Props>(), {
  columns: 4,
});

const emit = defineEmits<{
  addToCart: [product: ProductType];
}>();

function handleAddToCart(product: ProductType) {
  emit('addToCart', product);
}
</script>

<template>
  <div
    class="grid gap-3 sm:gap-4 md:gap-6"
    :class="{
      'grid-cols-2 md:grid-cols-2': columns === 2,
      'grid-cols-2 md:grid-cols-3': columns === 3,
      'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4': columns === 4,
    }"
  >
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
      @add-to-cart="handleAddToCart"
    />
  </div>
</template>
