<script setup lang="ts">
interface Props {
  count?: number;
  columns?: 2 | 3 | 4;
}

withDefaults(defineProps<Props>(), {
  count: 8,
  columns: 4,
});
</script>

<template>
  <div
    class="grid gap-3 sm:gap-4 md:gap-6"
    :class="{
      'grid-cols-2 md:grid-cols-2': columns === 2,
      'grid-cols-2 md:grid-cols-3': columns === 3,
      'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4': columns === 4,
    }"
  >
    <ProductCardSkeleton
      v-for="i in count"
      :key="i"
    />
  </div>
</template>
