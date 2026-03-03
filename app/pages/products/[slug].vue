<script setup lang="ts">
import type { ProductImage } from '~/features/products/types/product';

const route = useRoute();
const slug = computed(() => route.params.slug as string);
const { addItem } = useCart();
const { notifyItemAdded } = useCartNotification();
const { formatPrice } = useCurrency();
const { sanitizeHtml } = useSanitize();

const productsStore = useProductsStore();

const { data: product, status } = await useAsyncData(
  `product-${slug.value}`,
  () => productsStore.fetchProductBySlug(slug.value),
  { server: false, watch: [slug] }
);

const isLoading = computed(() => status.value === 'pending' || status.value === 'idle');

const category = computed(() => {
  if (!product.value?.product_type) return null;
  return product.value.product_type;
});

const sanitizedDescription = computed(() => {
  if (!product.value?.description) return null;
  const desc = product.value.description.trim();
  if (desc === 'null' || desc === 'undefined' || desc === '') return null;
  return sanitizeHtml(desc);
});

const sanitizedShortDescription = computed(() => {
  if (!product.value?.short_description) return null;
  const desc = product.value.short_description.trim();
  if (desc === 'null' || desc === 'undefined' || desc === '') return null;
  return desc;
});

const categorySlug = computed(() => {
  if (!category.value) return '';
  return category.value.name.toLowerCase().replace(/\s+/g, '-');
});

const productImages = computed(() => {
  if (!product.value) return [];
  if (product.value.images && product.value.images.length > 0) {
    // Handle both array of ProductImage objects and array of strings
    return product.value.images.map((img) => {
      if (typeof img === 'string') return img;
      return (img as ProductImage).url;
    });
  }
  if (product.value.image) {
    return [product.value.image];
  }
  return [];
});

const quantity = ref(1);
const isAdded = ref(false);
let addedTimeout: ReturnType<typeof setTimeout> | null = null;

function handleAddToCart() {
  if (!product.value) return;
  addItem({
    productId: String(product.value.id),
    name: product.value.name,
    price: product.value.price,
    currency: product.value.currency,
    quantity: quantity.value,
    image: product.value.image || undefined,
  });
  notifyItemAdded(product.value.name);

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

// Dynamic SEO
useHead({
  title: computed(() => product.value?.name || 'Product'),
});

useSeoMeta({
  description: computed(
    () =>
      sanitizedShortDescription.value ||
      `Shop ${product.value?.name || 'this product'} at great prices.`
  ),
});
</script>

<template>
  <div>
    <UContainer v-if="isLoading">
      <ProductDetailSkeleton />
    </UContainer>

    <UContainer v-else-if="product" class="py-6 sm:py-10">
      <nav class="mb-6 text-xs" aria-label="Breadcrumb">
        <ol class="flex flex-wrap items-center gap-1.5 text-gray-500 sm:gap-2">
          <li class="flex items-center gap-1.5 sm:gap-2">
            <NuxtLink to="/" class="hover:text-primary">Home</NuxtLink>
            <UIcon name="i-heroicons-chevron-right" class="size-3.5 text-gray-400" />
          </li>
          <li class="flex items-center gap-1.5 sm:gap-2">
            <NuxtLink to="/" class="hover:text-primary">Products</NuxtLink>
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

      <div class="grid gap-6 lg:grid-cols-2 lg:gap-10">
        <div>
          <ProductImageCarousel :images="productImages" :alt="product.name" />
        </div>

        <div class="flex flex-col">
          <h1 class="text-lg font-semibold text-gray-900 capitalize">
            {{ product.name }}
          </h1>

          <p class="mt-2 text-lg font-semibold text-primary">
            {{ formatPrice(product.price, product.currency) }}
          </p>

          <div v-if="product.is_sold" class="mt-3">
            <span
              class="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-600"
            >
              Sold Out
            </span>
          </div>

          <p v-if="sanitizedShortDescription" class="mt-3 text-sm text-gray-600">
            {{ sanitizedShortDescription }}
          </p>

          <div class="mt-5 flex flex-col gap-3">
            <div class="flex items-center gap-2">
              <span class="text-xs font-medium text-gray-700">Quantity:</span>
              <QuantitySelector v-model="quantity" :min="1" :disabled="product.is_sold" />
            </div>

            <button
              type="button"
              class="inline-flex w-fit cursor-pointer items-center justify-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-medium text-white transition-colors hover:bg-primary/75 disabled:cursor-not-allowed disabled:opacity-50"
              :class="{ 'bg-primary/85': isAdded }"
              :disabled="product.is_sold"
              @click="handleAddToCart"
            >
              <UIcon name="i-heroicons-shopping-cart" class="size-4" />
              <span>{{ isAdded ? 'Added to Cart' : 'Add to Cart' }}</span>
            </button>
          </div>

          <span class="my-5 block border-t border-gray-200" />

          <div v-if="sanitizedDescription">
            <!-- eslint-disable vue/no-v-html -->
            <div
              class="product-description text-xs leading-relaxed text-gray-600 [&_li]:text-gray-600 [&_p]:mb-2 [&_strong]:font-semibold [&_strong]:text-gray-900 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-4"
              v-html="sanitizedDescription"
            />
            <!-- eslint-enable vue/no-v-html -->
          </div>

          <div class="mt-5">
            <h2 class="text-sm font-semibold text-gray-900">Product Details</h2>
            <dl class="mt-2 space-y-1.5 text-xs">
              <div class="flex justify-between">
                <dt class="text-gray-500">Availability</dt>
                <dd
                  class="font-medium"
                  :class="product.is_sold ? 'text-red-600' : 'text-green-600'"
                >
                  {{ product.is_sold ? 'Out of Stock' : 'In Stock' }}
                </dd>
              </div>
              <div v-if="category" class="flex justify-between">
                <dt class="text-gray-500">Category</dt>
                <dd class="font-medium text-gray-900">{{ category.name }}</dd>
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
