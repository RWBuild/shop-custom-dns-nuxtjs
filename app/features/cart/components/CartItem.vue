<script setup lang="ts">
import { formatCurrency } from '~/features/shared/utils';
import type { CartItem } from '../types/cart.types';

interface Props {
  item: CartItem;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  increment: [id: string];
  decrement: [id: string];
  remove: [id: string];
}>();

function handleDecrement() {
  if (props.item.quantity <= 1) {
    emit('remove', props.item.id);
  } else {
    emit('decrement', props.item.id);
  }
}
</script>

<template>
  <div class="flex gap-2.5">
    <div class="relative size-14 shrink-0 overflow-hidden rounded-md bg-gray-100">
      <NuxtImg
        v-if="item.image"
        :src="item.image"
        :alt="item.name"
        class="size-full object-cover"
        loading="lazy"
      />
      <div v-else class="flex size-full items-center justify-center">
        <UIcon name="i-lucide-image" class="size-5 text-gray-300" />
      </div>
    </div>

    <div class="flex flex-1 flex-col justify-between py-0.5">
      <div class="flex items-start justify-between gap-2">
        <h4 class="text-xs font-medium text-gray-900 line-clamp-1">
          {{ item.name }}
        </h4>
        <button
          type="button"
          class="shrink-0 cursor-pointer p-0.5 text-gray-500 transition-colors hover:text-red-500"
          aria-label="Remove item"
          @click="emit('remove', item.id)"
        >
          <UIcon name="i-lucide-x" class="size-3.5" />
        </button>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-0.5">
          <button
            type="button"
            class="flex size-6 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
            @click="handleDecrement"
          >
            <UIcon name="i-lucide-minus" class="size-3" />
          </button>
          <span class="w-6 text-center text-xs font-medium text-gray-900">
            {{ item.quantity }}
          </span>
          <button
            type="button"
            class="flex size-6 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
            @click="emit('increment', item.id)"
          >
            <UIcon name="i-lucide-plus" class="size-3" />
          </button>
        </div>

        <p class="text-xs font-semibold text-gray-900">
          {{ formatCurrency(item.price * item.quantity, item.currency) }}
        </p>
      </div>
    </div>
  </div>
</template>
