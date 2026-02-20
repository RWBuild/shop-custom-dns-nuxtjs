<script setup lang="ts">
import { useRouteActive } from '~/features/shared/composables/useRouteActive';

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
}>();

const { isActive } = useRouteActive();

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
});

function closeDrawer() {
  isOpen.value = false;
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
    :ui="{ content: 'w-[280px] max-w-[80vw] h-[100dvh] min-h-screen' }"
  >
    <template #content>
      <div class="flex h-full flex-col bg-white">
        <div class="flex items-center justify-between px-4 py-4">
          <NuxtLink
            to="/"
            class="text-sm font-semibold tracking-tight text-gray-800"
            @click="handleNavClick"
          >
            Logo
          </NuxtLink>
          <button
            type="button"
            class="-mr-1.5 cursor-pointer p-1.5 text-gray-500 transition-colors hover:text-gray-700"
            aria-label="Close menu"
            @click="closeDrawer"
          >
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>

        <div class="mx-4 border-t border-gray-100" />

        <nav class="flex-1 overflow-y-auto px-2 py-3">
          <NuxtLink
            v-for="item in navigation"
            :key="item.to"
            :to="item.to"
            class="mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors"
            :class="
              isActive(item.to)
                ? 'bg-primary-50 text-primary-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            "
            @click="handleNavClick"
          >
            <span
              class="size-1 rounded-full transition-colors"
              :class="isActive(item.to) ? 'bg-primary' : 'bg-gray-300'"
            />
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>
    </template>
  </USlideover>
</template>
