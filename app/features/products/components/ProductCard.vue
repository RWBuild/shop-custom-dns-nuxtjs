<script setup lang="ts">
import type { Product, ProductListItem } from '~/features/products/types/product';

interface Props {
  product: Product | ProductListItem;
}

defineProps<Props>();

const emit = defineEmits<{
  addToCart: [product: Product | ProductListItem];
}>();

const { formatPrice } = useCurrency();

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
</script>

<template>
  <article
    class="group flex h-full flex-col rounded-xl p-2 transition-colors duration-200 hover:bg-gray-50 sm:rounded-2xl sm:p-3"
  >
    <NuxtLink :to="`/products/${product.slug}`" class="block">
      <div class="relative aspect-square overflow-hidden rounded-lg bg-gray-200 sm:rounded-xl">
        <NuxtImg
          v-if="product.image"
          :src="product.image"
          :alt="product.name"
          class="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          loading="lazy"
          format="webp"
          quality="80"
          placeholder
        />
        <div v-else class="flex h-full w-full items-center justify-center">
          <UIcon name="i-lucide-image" class="size-10 text-gray-50" />
        </div>
        <span
          v-if="product.is_sold"
          class="absolute right-1.5 top-1.5 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-medium text-white sm:right-2 sm:top-2 sm:px-2.5 sm:py-1 sm:text-xs"
        >
          Sold Out
        </span>
      </div>
    </NuxtLink>

    <div class="mt-2 flex flex-1 flex-col gap-0.5 sm:mt-2.5 sm:gap-0.5">
      <NuxtLink :to="`/products/${product.slug}`" class="block">
        <h3
          class="line-clamp-2 text-xs font-medium text-neutral-900 transition-colors duration-200 group-hover:text-primary sm:line-clamp-1 sm:text-sm capitalize"
        >
          {{ product.name }}
        </h3>
      </NuxtLink>

      <p class="text-xs font-semibold text-primary sm:text-sm">
        {{ formatPrice(product.price, product.currency) }}
      </p>

      <button
        type="button"
        class="mt-1.5 inline-flex w-full cursor-pointer items-center justify-center gap-1 rounded-full bg-gray-800 px-2.5 py-1.5 text-[10px] font-medium text-white transition-colors duration-200 hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit sm:gap-1 sm:px-3 sm:py-1.5 sm:text-[10px]"
        :class="{ 'bg-gray-900': isAdded }"
        :disabled="product.is_sold"
        @click.prevent="handleAddToCart(product)"
      >
        <UIcon name="i-heroicons-shopping-cart" class="size-3" />
        <span>{{ isAdded ? 'Added' : 'Add to cart' }}</span>
      </button>
    </div>
  </article>
</template>
