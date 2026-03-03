<script setup lang="ts">
import type { Category } from '~/features/products/types/category';
import type { Product, ProductListItem } from '~/features/products/types/product';

type ProductType = Product | ProductListItem;

export interface CategoryTab extends Category {
  slug: string;
}

interface Props {
  categories: CategoryTab[];
  products: ProductType[];
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
});

const emit = defineEmits<{
  addToCart: [product: ProductType];
  tabChange: [categoryId: number | null];
}>();

const { trackCategoryView } = useAnalytics();

const activeTab = ref('all');
const tabsRef = ref<HTMLElement | null>(null);
const isTabsHidden = ref(false);

const tabs = computed(() => [
  { id: null, label: 'All', slug: 'all' },
  ...props.categories.map((cat) => ({
    id: cat.id,
    label: cat.name,
    slug: cat.slug,
  })),
]);

function handleAddToCart(product: ProductType) {
  emit('addToCart', product);
}

function setActiveTab(slug: string, categoryId: number | null, label: string) {
  activeTab.value = slug;
  emit('tabChange', categoryId);
  if (categoryId !== null) {
    trackCategoryView({ name: label, id: categoryId });
  }
}

onMounted(() => {
  emit('tabChange', null);

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
    <div ref="tabsRef" class="mb-4 border-b border-gray-200 sm:mb-5">
      <nav class="-mb-px flex gap-1 overflow-x-auto scrollbar-hide sm:gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.slug"
          type="button"
          class="relative shrink-0 cursor-pointer px-3 py-1.5 text-[12px] font-medium transition-colors duration-200 sm:px-4 sm:py-2 sm:text-xs"
          :class="[activeTab === tab.slug ? 'text-primary' : 'text-gray-500 hover:text-gray-700']"
          @click="setActiveTab(tab.slug, tab.id, tab.label)"
        >
          {{ tab.label }}
          <span
            class="absolute bottom-0 left-0 right-0 h-0.75 origin-center rounded-full transition-all duration-300 ease-out"
            :class="[
              activeTab === tab.slug ? 'scale-x-100 bg-primary' : 'scale-x-0 bg-transparent',
            ]"
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
            <nav class="-mb-px flex gap-1 overflow-x-auto scrollbar-hide sm:gap-2">
              <button
                v-for="tab in tabs"
                :key="`fixed-${tab.slug}`"
                type="button"
                class="relative shrink-0 cursor-pointer px-3 py-1.5 text-[11px] font-medium transition-colors duration-200 sm:px-4 sm:py-2 sm:text-xs"
                :class="[
                  activeTab === tab.slug ? 'text-primary' : 'text-gray-500 hover:text-gray-700',
                ]"
                @click="setActiveTab(tab.slug, tab.id, tab.label)"
              >
                {{ tab.label }}
                <span
                  class="absolute bottom-0 left-0 right-0 h-[3px] origin-center rounded-full transition-all duration-300 ease-out"
                  :class="[
                    activeTab === tab.slug ? 'scale-x-100 bg-primary' : 'scale-x-0 bg-transparent',
                  ]"
                />
              </button>
            </nav>
          </div>
        </div>
      </Transition>
    </Teleport>

    <ProductGridSkeleton v-if="isLoading" :count="8" :columns="4" />
    <ProductGrid
      v-else-if="products.length > 0"
      :products="products"
      :columns="4"
      @add-to-cart="handleAddToCart"
    />
    <div v-else class="py-10 text-center sm:py-12">
      <p class="text-[11px] text-gray-500 sm:text-xs">No products in this category yet.</p>
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
