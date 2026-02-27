<script setup lang="ts">
import type { Product, ProductListItem } from '~/features/products/types/product';
import type { Category } from '~/features/products/types/category';

type ProductType = Product | ProductListItem;

export interface CategoryWithProducts extends Category {
  slug: string;
  products: ProductType[];
}

interface Props {
  categories: CategoryWithProducts[];
  allProducts: ProductType[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  addToCart: [product: ProductType];
}>();

const activeTab = ref('all');
const tabsRef = ref<HTMLElement | null>(null);
const isTabsHidden = ref(false);

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

function handleAddToCart(product: ProductType) {
  emit('addToCart', product);
}

function setActiveTab(slug: string) {
  activeTab.value = slug;
}

onMounted(() => {
  if (!tabsRef.value) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry) {
        isTabsHidden.value = !entry.isIntersecting;
      }
    },
    {
      rootMargin: '-56px 0px 0px 0px',
      threshold: 0,
    }
  );

  observer.observe(tabsRef.value);

  onUnmounted(() => {
    observer.disconnect();
  });
});
</script>

<template>
  <section>
    <div ref="tabsRef" class="mb-4 border-b border-gray-200 sm:mb-6">
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
          @click="setActiveTab(tab.slug)"
        >
          {{ tab.label }}
          <span
            class="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300 ease-out"
            :class="[activeTab === tab.slug ? 'bg-primary' : 'bg-transparent']"
          />
        </button>
      </nav>
    </div>

    <Teleport to="body">
      <Transition
        enter-active-class="transition-transform duration-200 ease-out"
        enter-from-class="-translate-y-full"
        enter-to-class="translate-y-0"
        leave-active-class="transition-transform duration-150 ease-in"
        leave-from-class="translate-y-0"
        leave-to-class="-translate-y-full"
      >
        <div
          v-if="isTabsHidden"
          class="fixed left-0 right-0 top-14 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm sm:top-16"
        >
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav class="-mb-px flex overflow-x-auto scrollbar-hide">
              <button
                v-for="tab in tabs"
                :key="`fixed-${tab.slug}`"
                type="button"
                class="relative shrink-0 cursor-pointer px-3 py-2 text-xs font-medium transition-colors duration-200 sm:px-4 sm:py-2.5 sm:text-sm"
                :class="[
                  activeTab === tab.slug
                    ? 'text-primary'
                    : 'text-gray-500 hover:text-gray-700',
                ]"
                @click="setActiveTab(tab.slug)"
              >
                {{ tab.label }}
                <span
                  class="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300 ease-out"
                  :class="[activeTab === tab.slug ? 'bg-primary' : 'bg-transparent']"
                />
              </button>
            </nav>
          </div>
        </div>
      </Transition>
    </Teleport>

    <ProductGrid
      v-if="activeProducts.length > 0"
      :products="activeProducts"
      :columns="4"
      @add-to-cart="handleAddToCart"
    />
    <div v-else class="py-12 text-center sm:py-16">
      <p class="text-xs text-gray-400 sm:text-sm">No products in this category yet.</p>
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
