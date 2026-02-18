<script setup lang="ts">
interface NavigationItem {
  label: string;
  to: string;
}

interface Props {
  open: boolean;
  navigation: NavigationItem[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  search: [query: string];
}>();

const route = useRoute();
const searchQuery = ref('');

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
});

function isActive(path: string) {
  return route.path === path;
}

function closeDrawer() {
  isOpen.value = false;
}

function handleSearch() {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value);
    closeDrawer();
  }
}

function handleNavClick() {
  closeDrawer();
}
</script>

<template>
  <USlideover
    v-model:open="isOpen"
    side="left"
    class="lg:hidden"
    :ui="{ content: 'w-[280px] max-w-[80vw]' }"
  >
    <template #content>
      <div class="flex flex-col h-full bg-white">
        <div class="flex items-center justify-between px-4 py-4">
          <NuxtLink
            to="/"
            class="text-sm font-semibold text-gray-800 tracking-tight"
            @click="handleNavClick"
          >
            Logo
          </NuxtLink>
          <button
            type="button"
            class="p-1.5 -mr-1.5 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close menu"
            @click="closeDrawer"
          >
            <UIcon name="i-lucide-x" class="w-4 h-4" />
          </button>
        </div>

        <div class="px-4 pb-4">
          <AppInput
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            icon="i-lucide-search"
            @keyup.enter="handleSearch"
          />
        </div>

        <div class="mx-4 border-t border-gray-100" />

        <nav class="flex-1 overflow-y-auto px-2 py-3">
          <NuxtLink
            v-for="item in navigation"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2.5 mb-0.5 text-xs font-medium rounded-lg transition-colors"
            :class="
              isActive(item.to)
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            "
            @click="handleNavClick"
          >
            <span
              class="w-1 h-1 rounded-full transition-colors"
              :class="isActive(item.to) ? 'bg-primary' : 'bg-gray-300'"
            />
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>
    </template>
  </USlideover>
</template>
