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
    <UContainer class="py-6">
      <ShopBanner
        image="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80"
        image-alt="Shop promotional banner"
        aspect-ratio="21/9"
      />
    </UContainer>

    <UContainer class="py-8">
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
