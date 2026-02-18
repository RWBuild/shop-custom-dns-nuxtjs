<script setup lang="ts">
const route = useRoute();
const { cartCount } = useCart();
const { openDrawer: openCartDrawer } = useCartDrawer();
const { isAnimating: isCartAnimating } = useCartNotification();

const navigation = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
];

const isSearchOpen = ref(false);
const searchQuery = ref('');
const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);

function handleScroll() {
  isScrolled.value = window.scrollY > 0;
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

function isActive(path: string) {
  return route.path === path;
}

function toggleSearch() {
  isSearchOpen.value = !isSearchOpen.value;
  if (!isSearchOpen.value) {
    searchQuery.value = '';
  }
}

function closeSearch() {
  isSearchOpen.value = false;
  searchQuery.value = '';
}

function handleSearch(query?: string) {
  const searchTerm = query || searchQuery.value;
  if (searchTerm.trim()) {
  }
}
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
          <span class="text-base sm:text-lg font-semibold text-gray-900">Logo</span>
        </NuxtLink>

        <div class="hidden lg:flex items-center gap-4 xl:gap-6">
          <NuxtLink
            v-for="item in navigation"
            :key="item.to"
            :to="item.to"
            class="nav-link relative px-1 py-5 text-xs lg:text-sm font-medium transition-colors"
            :class="
              isActive(item.to)
                ? 'text-primary-600'
                : 'text-gray-600 hover:text-primary-600'
            "
          >
            {{ item.label }}
            <span
              class="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.75 bg-primary rounded-full transition-all duration-300 ease-out"
              :class="isActive(item.to) ? 'w-2/5' : 'w-0'"
            />
          </NuxtLink>
        </div>

        <div class="flex items-center gap-0.5 sm:gap-1 lg:gap-2">
          <div class="relative hidden sm:flex items-center">
            <div
              class="flex items-center overflow-hidden transition-all duration-300 ease-out"
              :class="isSearchOpen ? 'w-48 md:w-56 lg:w-64' : 'w-0'"
            >
              <AppInput
                v-model="searchQuery"
                type="text"
                placeholder="Search..."
                icon="i-lucide-search"
                :autofocus="isSearchOpen"
                @keyup.enter="handleSearch()"
                @keyup.escape="closeSearch"
              />
            </div>
            <UButton
              :icon="isSearchOpen ? 'i-lucide-x' : 'i-lucide-search'"
              color="neutral"
              variant="ghost"
              size="sm"
              class="cursor-pointer lg:size-md rounded-full"
              aria-label="Search"
              @click="toggleSearch"
            />
          </div>

          <UButton
            icon="i-lucide-search"
            color="neutral"
            variant="ghost"
            size="sm"
            class="sm:hidden cursor-pointer"
            aria-label="Search"
            @click="isMobileMenuOpen = true"
          />

          <button
            type="button"
            class="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
            aria-label="Cart"
            @click="openCartDrawer"
          >
            <UIcon
              name="i-lucide-shopping-cart"
              class="w-4 h-4 text-gray-700"
            />
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

    <AppMobileDrawer
      v-model:open="isMobileMenuOpen"
      :navigation="navigation"
      @search="handleSearch"
    />
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
