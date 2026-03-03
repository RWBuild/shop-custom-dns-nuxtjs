<script setup lang="ts">
import { useProductSearch } from '~/features/products/composables/useProductSearch';
import { useRouteActive } from '~/features/shared/composables/useRouteActive';
import { useScrollDetection } from '~/features/shared/composables/useScrollDetection';

const { cartCount } = useCart();
const { openDrawer: openCartDrawer } = useCartDrawer();
const { isAnimating: isCartAnimating } = useCartNotification();
const { isActive } = useRouteActive();
const { isScrolled } = useScrollDetection();
const { logoUrl, shopName } = useShopInfo();

const {
  searchQuery,
  suggestions,
  isLoading,
  isOpen: isSearchOpen,
  handleInput,
  openSearch,
  closeSearch,
  selectSuggestion,
  submitSearch,
} = useProductSearch();

const navigation = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
];

const isMobileMenuOpen = ref(false);
const isMobileSearchOpen = ref(false);
const searchInputRef = ref<HTMLInputElement | null>(null);

function toggleSearch() {
  if (isSearchOpen.value) {
    closeSearch();
  } else {
    openSearch();
    nextTick(() => {
      searchInputRef.value?.focus();
    });
  }
}

function handleSearchInput(event: Event) {
  const target = event.target as HTMLInputElement;
  handleInput(target.value);
}

function handleSearchSubmit() {
  submitSearch();
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (!target.closest('.search-container')) {
    closeSearch();
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <header
    class="sticky top-0 z-50 bg-white transition-shadow duration-300"
    :class="isScrolled ? 'shadow-[0_1px_3px_rgba(0,0,0,0.05)]' : ''"
  >
    <UContainer>
      <nav class="flex items-center justify-between h-14 sm:h-16 lg:h-18">
        <UButton
          icon="i-lucide-menu"
          color="neutral"
          variant="ghost"
          size="sm"
          class="lg:hidden -ml-2"
          aria-label="Open menu"
          @click="isMobileMenuOpen = true"
        />

        <NuxtLink to="/" class="flex items-center gap-1.5 sm:gap-2">
          <NuxtImg
            v-if="logoUrl"
            :src="logoUrl"
            :alt="shopName"
            class="h-8 sm:h-10 w-auto object-contain"
            loading="eager"
          />
          <span v-else class="text-base sm:text-lg font-semibold text-gray-900">{{ shopName || 'Logo' }}</span>
        </NuxtLink>

        <div class="hidden lg:flex items-center gap-4 xl:gap-6">
          <NuxtLink
            v-for="item in navigation"
            :key="item.to"
            :to="item.to"
            class="nav-link relative px-1 py-5 text-xs lg:text-sm font-medium transition-colors"
            :class="isActive(item.to) ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'"
          >
            {{ item.label }}
            <span
              class="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary rounded-full transition-all duration-300 ease-out"
              :class="isActive(item.to) ? 'w-2/5' : 'w-0'"
            />
          </NuxtLink>
        </div>

        <div class="flex items-center gap-0.5 sm:gap-1 lg:gap-2">
          <div class="relative hidden sm:block search-container">
            <div class="flex items-center">
              <div
                class="relative overflow-hidden transition-all duration-300 ease-out"
                :class="isSearchOpen ? 'w-64 md:w-72 lg:w-80' : 'w-0'"
              >
                <input
                  ref="searchInputRef"
                  :value="searchQuery"
                  type="text"
                  placeholder="Search products..."
                  class="w-full h-9 pl-9 pr-3 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-colors"
                  @input="handleSearchInput"
                  @keyup.enter="handleSearchSubmit"
                  @keyup.escape="closeSearch"
                  @focus="openSearch"
                >
                <UIcon
                  name="i-lucide-search"
                  class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none"
                />
              </div>

              <UButton
                :icon="isSearchOpen ? 'i-lucide-x' : 'i-lucide-search'"
                color="neutral"
                variant="ghost"
                size="sm"
                class="cursor-pointer lg:size-md rounded-full ml-1 shrink-0"
                aria-label="Search"
                @click.stop="toggleSearch"
              />
            </div>

            <SearchDropdown
              v-if="isSearchOpen"
              :suggestions="suggestions"
              :is-loading="isLoading"
              :query="searchQuery"
              @select-product="selectSuggestion"
              @submit="submitSearch"
            />
          </div>

          <UButton
            icon="i-lucide-search"
            color="neutral"
            variant="ghost"
            size="sm"
            class="sm:hidden cursor-pointer"
            aria-label="Search"
            @click="isMobileSearchOpen = true"
          />

          <button
            type="button"
            class="flex items-center gap-1.5 px-2.5 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
            aria-label="Cart"
            @click="openCartDrawer"
          >
            <UIcon name="i-lucide-shopping-cart" class="size-4 text-gray-700" />
            <span
              class="flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] font-semibold text-white bg-primary rounded-full transition-transform"
              :class="isCartAnimating ? 'cart-badge-bounce' : ''"
            >
              {{ cartCount > 99 ? '99+' : cartCount }}
            </span>
          </button>
        </div>
      </nav>
    </UContainer>

    <AppMobileDrawer v-model:open="isMobileMenuOpen" :navigation="navigation" />
    <AppMobileSearch v-model:open="isMobileSearchOpen" />
  </header>
</template>

<style scoped>
.nav-link:hover span,
.nav-link.router-link-active span {
  width: 40%;
}

@media (min-width: 1024px) {
  .h-18 {
    height: 4.5rem; 
  }

  .lg\:size-md {
    --button-size: 2.25rem;
  }
}

.cart-badge-bounce {
  animation: cartBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes cartBounce {
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.3);
  }
  50% {
    transform: scale(0.9);
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
