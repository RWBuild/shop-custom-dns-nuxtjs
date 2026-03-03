<script setup lang="ts">
import type { Product, ProductListItem } from '~/features/products/types/product';
import { slugify } from '~/features/shared/utils';

type ProductType = Product | ProductListItem;

const { shopName } = useShopInfo();

useSeo({
  title: shopName.value || 'Home',
  description: '',
});

const { addItem } = useCart();
const { notifyItemAdded } = useCartNotification();
const { trackPageView, trackAddToCart } = useAnalytics();

const productsStore = useProductsStore();
const categoriesStore = useCategoriesStore();

const hasFetched = ref(false);
const isInitialLoading = computed(() => !hasFetched.value || categoriesStore.isLoading);
const isFilteringProducts = ref(false);

// Transform categories for tabs
const categoryTabs = computed(() => {
  return categoriesStore.categories.map((cat) => ({
    ...cat,
    slug: slugify(cat.name),
  }));
});

// Products from store
const products = computed(() => productsStore.products);

async function handleTabChange(categoryId: number | null) {
  isFilteringProducts.value = true;
  await productsStore.filterByCategory(categoryId);
  isFilteringProducts.value = false;
}

onMounted(async () => {
  trackPageView('Landing page');
  await Promise.all([
    categoriesStore.fetchCategories(),
    productsStore.fetchProducts(),
  ]);
  hasFetched.value = true;
});

function handleAddToCart(product: ProductType) {
  addItem({
    productId: String(product.id),
    name: product.name,
    price: product.price,
    currency: product.currency,
    quantity: 1,
    image: product.image || undefined,
  });
  trackAddToCart({ name: product.name, id: product.id, price: product.price });
  notifyItemAdded(product.name);
}

// Infinite scroll with IntersectionObserver
const loadMoreTrigger = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!loadMoreTrigger.value) return;

  const observer = new IntersectionObserver(
    async (entries) => {
      const entry = entries[0];
      if (entry?.isIntersecting && productsStore.hasMorePages && !productsStore.isLoading) {
        await productsStore.loadMore();
      }
    },
    { rootMargin: '100px' },
  );

  watch(loadMoreTrigger, (el) => {
    if (el) observer.observe(el);
  }, { immediate: true });

  onUnmounted(() => observer.disconnect());
});
</script>

<template>
  <div>
    <div class="py-4 sm:px-4 sm:py-6 md:px-6 lg:px-8">
      <div class="mx-auto sm:max-w-7xl">
        <ShopBanner height="md" />
      </div>
    </div>

    <UContainer class="py-6 sm:py-10">
      <h2 class="mb-4 text-sm font-bold uppercase tracking-wide text-neutral-900">
        Shop by Categories
      </h2>

      <CategoryTabsSkeleton v-if="isInitialLoading" />
      <CategoryProductTabs
        v-else
        :categories="categoryTabs"
        :products="products"
        :is-loading="isFilteringProducts"
        @add-to-cart="handleAddToCart"
        @tab-change="handleTabChange"
      />

      <!-- Load more trigger for infinite scroll -->
      <div
        v-if="productsStore.hasMorePages"
        ref="loadMoreTrigger"
        class="flex justify-center py-8"
      >
        <UIcon
          v-if="productsStore.isLoading"
          name="i-lucide-loader-2"
          class="size-6 animate-spin text-primary"
        />
      </div>

      <!-- Error state -->
      <div v-if="productsStore.error" class="mt-4 rounded-lg bg-red-50 p-4 text-center text-red-600">
        {{ productsStore.error }}
      </div>
    </UContainer>
  </div>
</template>
