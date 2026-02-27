<script setup lang="ts">
import type { Product, ProductListItem } from '~/features/products/types/product';

interface Props {
  product: Product | ProductListItem;
}

defineProps<Props>();

const { formatPrice } = useCurrency();

const emit = defineEmits<{
  addToCart: [product: Product | ProductListItem];
}>();

const isAdded = ref(false);
let addedTimeout: ReturnType<typeof setTimeout> | null = null;

function handleAddToCart(product: Product | ProductListItem) {
  emit('addToCart', product);

  if (addedTimeout) {
    clearTimeout(addedTimeout);
  }

  isAdded.value = true;
  addedTimeout = setTimeout(() => {
    isAdded.value = false;
  }, 2000);
}

onUnmounted(() => {
  if (addedTimeout) {
    clearTimeout(addedTimeout);
  }
});

const placeholderImage = 'https://placehold.co/400x400/f3f6f8/7493b2?text=No+Image';
</script>

<template>
  <article
    class="group flex h-full flex-col rounded-xl p-2 transition-colors duration-200 hover:bg-gray-50 sm:rounded-2xl sm:p-3"
  >
    <NuxtLink :to="`/products/${product.slug}`" class="block">
      <div class="relative aspect-square overflow-hidden rounded-lg bg-gray-100 sm:rounded-xl">
        <NuxtImg
          :src="product.image || placeholderImage"
          :alt="product.name"
          class="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          loading="lazy"
          format="webp"
          quality="80"
          placeholder
        />
        <span
          v-if="product.is_sold"
          class="absolute right-1.5 top-1.5 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-medium text-white sm:right-2 sm:top-2 sm:px-2.5 sm:py-1 sm:text-xs"
        >
          Sold Out
        </span>
      </div>
    </NuxtLink>

    <div class="mt-2 flex flex-1 flex-col gap-0.5 sm:mt-3 sm:gap-1">
      <NuxtLink :to="`/products/${product.slug}`" class="block">
        <h3
          class="line-clamp-2 text-xs font-medium text-neutral-900 transition-colors duration-200 group-hover:text-primary sm:line-clamp-1 sm:text-sm"
        >
          {{ product.name }}
        </h3>
      </NuxtLink>

      <p class="text-xs font-semibold text-primary sm:text-sm">
        {{ formatPrice(product.price) }}
      </p>

      <button
        type="button"
        class="mt-auto inline-flex w-full cursor-pointer items-center justify-center gap-1 rounded-full bg-gray-800 px-3 py-1.5 pt-2 text-[10px] font-medium text-white transition-colors duration-200 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit sm:gap-1.5 sm:px-4 sm:py-2 sm:text-xs"
        :class="{ 'bg-gray-900': isAdded }"
        :disabled="product.is_sold"
        @click.prevent="handleAddToCart(product)"
      >
        <UIcon name="i-heroicons-shopping-cart" class="size-3 sm:size-3.5" />
        <span>{{ isAdded ? 'Added to cart' : 'Add to cart' }}</span>
      </button>
    </div>
  </article>
</template>
