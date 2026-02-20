<script setup lang="ts">
import type { CategoryWithProducts } from '~/features/home/components/CategoryProductTabs.vue';
import type { Product } from '~/features/products/types/product';
import { getMockCategories, getMockProducts, getMockProductsByCategory } from '~/mocks';
import { slugify } from '~/features/shared/utils';

useSeo({
  title: 'Home',
  description: '',
});

const { addItem } = useCart();
const { notifyItemAdded } = useCartNotification();

const isLoading = ref(true);
const allProducts = ref<Product[]>([]);
const categories = ref<CategoryWithProducts[]>([]);

onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const mockCategories = getMockCategories();
  allProducts.value = getMockProducts();
  categories.value = mockCategories.map((cat) => ({
    ...cat,
    slug: slugify(cat.name),
    products: getMockProductsByCategory(cat.id),
  }));

  isLoading.value = false;
});

function handleAddToCart(product: Product) {
  addItem({
    productId: String(product.id),
    name: product.name,
    price: product.price,
    quantity: 1,
    image: product.image || undefined,
  });
  notifyItemAdded(product.name);
}
</script>

<template>
  <div>
    <div class="py-4 sm:px-4 sm:py-6 md:px-6 lg:px-8">
      <div class="mx-auto sm:max-w-7xl">
        <ShopBanner
          image="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=80"
          image-alt="Shop promotional banner"
          height="md"
        />
      </div>
    </div>

    <UContainer class="py-6 sm:py-10">
      <h2 class="mb-4 text-sm font-bold uppercase tracking-wide text-neutral-900">
        Shop by Categories
      </h2>

      <CategoryTabsSkeleton v-if="isLoading" />
      <CategoryProductTabs
        v-else
        :categories="categories"
        :all-products="allProducts"
        @add-to-cart="handleAddToCart"
      />
    </UContainer>
  </div>
</template>
