<script setup lang="ts">
import type { Product } from '~/features/products/types/product';
import { getMockCategories, getMockProducts } from '~/mocks';

const route = useRoute();
const slug = route.params.slug as string;
const { addItem } = useCart();
const { notifyItemAdded } = useCartNotification();

const isLoading = ref(true);
const product = ref<Product | undefined>(undefined);
const category = ref<{ id: number; name: string } | null>(null);

const categorySlug = computed(() => {
  if (!category.value) return '';
  return category.value.name.toLowerCase().replace(/\s+/g, '-');
});

const productImages = computed(() => {
  if (!product.value) return [];
  if (product.value.images && product.value.images.length > 0) {
    return product.value.images;
  }
  if (product.value.image) {
    return [product.value.image];
  }
  return [];
});

const quantity = ref(1);

function formatPrice(price: number, currency: string): string {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  return `${formatted} ${currency}`;
}

function handleAddToCart() {
  if (!product.value) return;
  addItem({
    productId: String(product.value.id),
    name: product.value.name,
    price: product.value.price,
    quantity: quantity.value,
    image: product.value.image || undefined,
  });
  notifyItemAdded(product.value.name);
}

onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const allProducts = getMockProducts();
  const allCategories = getMockCategories();

  product.value = allProducts.find((p) => p.slug === slug);

  if (product.value?.category_id) {
    category.value = allCategories.find((c) => c.id === product.value?.category_id) || null;
  }

  isLoading.value = false;
});

useSeo({
  title: product.value?.name || 'Product',
  description: product.value?.short_description || '',
});
</script>

<template>
  <div>
    <UContainer v-if="isLoading">
      <ProductDetailSkeleton />
    </UContainer>

    <UContainer v-else-if="product" class="py-6 sm:py-10">
      <nav class="mb-6 text-sm">
        <ol class="flex flex-wrap items-center gap-1.5 text-gray-500 sm:gap-2">
          <li class="flex items-center gap-1.5 sm:gap-2">
            <NuxtLink to="/" class="hover:text-primary">Home</NuxtLink>
            <UIcon name="i-heroicons-chevron-right" class="size-3.5 text-gray-400" />
          </li>
          <li class="flex items-center gap-1.5 sm:gap-2">
            <NuxtLink to="/products" class="hover:text-primary">Products</NuxtLink>
            <UIcon name="i-heroicons-chevron-right" class="size-3.5 text-gray-400" />
          </li>
          <li v-if="category" class="flex items-center gap-1.5 sm:gap-2">
            <NuxtLink :to="`/?category=${categorySlug}`" class="hover:text-primary">
              {{ category.name }}
            </NuxtLink>
            <UIcon name="i-heroicons-chevron-right" class="size-3.5 text-gray-400" />
          </li>
          <li class="truncate font-medium text-gray-900">
            {{ product.name }}
          </li>
        </ol>
      </nav>

      <div class="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <ProductImageCarousel :images="productImages" :alt="product.name" />
        </div>

        <div class="flex flex-col">
          <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">
            {{ product.name }}
          </h1>

          <p class="mt-4 text-2xl font-bold text-primary sm:text-3xl">
            {{ formatPrice(product.price, product.currency) }}
          </p>

          <div v-if="product.is_sold" class="mt-4">
            <span class="inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600">
              Sold Out
            </span>
          </div>

          <p v-if="product.short_description" class="mt-4 text-gray-600">
            {{ product.short_description }}
          </p>

          <div class="mt-6 flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <span class="text-sm font-medium text-gray-700">Quantity:</span>
              <QuantitySelector v-model="quantity" :min="1" :max="10" :disabled="product.is_sold" />
            </div>

            <button
              type="button"
              class="inline-flex w-fit flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-gray-700 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              :disabled="product.is_sold"
              @click="handleAddToCart"
            >
              <UIcon name="i-heroicons-shopping-cart" class="size-5" />
              <span>Add to Cart</span>
            </button>
          </div>

          <span class="my-6 block border-t border-gray-200" />

          <div v-if="product.description">
            <!-- eslint-disable vue/no-v-html -->
            <div
              class="product-description mt-3 text-sm leading-relaxed text-gray-600 [&_li]:text-gray-600 [&_p]:mb-3 [&_strong]:font-semibold [&_strong]:text-gray-900 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5"
              v-html="product.description"
            />
            <!-- eslint-enable vue/no-v-html -->
          </div>

          <div class="mt-6">
            <h2 class="text-lg font-semibold text-gray-900">Product Details</h2>
            <dl class="mt-3 space-y-2 text-sm">
              <div class="flex justify-between">
                <dt class="text-gray-500">Availability</dt>
                <dd
                  class="font-medium"
                  :class="product.is_sold ? 'text-red-600' : 'text-green-600'"
                >
                  {{ product.is_sold ? 'Out of Stock' : 'In Stock' }}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </UContainer>

    <UContainer v-else class="py-20 text-center">
      <UIcon name="i-heroicons-exclamation-circle" class="mx-auto size-16 text-gray-300" />
      <h1 class="mt-4 text-2xl font-bold text-gray-900">Product Not Found</h1>
      <p class="mt-2 text-gray-500">
        The product you're looking for doesn't exist or has been removed.
      </p>
      <NuxtLink to="/" class="mt-6 inline-flex items-center gap-2 text-primary hover:underline">
        <UIcon name="i-heroicons-arrow-left" class="size-4" />
        <span>Back to Home</span>
      </NuxtLink>
    </UContainer>
  </div>
</template>
