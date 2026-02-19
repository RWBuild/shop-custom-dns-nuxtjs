<script setup lang="ts">
interface Props {
  tabCount?: number;
  productCount?: number;
}

withDefaults(defineProps<Props>(), {
  tabCount: 5,
  productCount: 8,
});
</script>

<template>
  <section>
    <div class="mb-4 border-b border-gray-300 sm:mb-6">
      <div class="flex gap-2 pb-3">
        <div
          v-for="i in tabCount"
          :key="i"
          class="h-6 animate-pulse rounded bg-gray-200"
          :class="i === 1 ? 'w-12' : 'w-20'"
        />
      </div>
    </div>
    <ProductGridSkeleton :count="productCount" :columns="4" />
  </section>
</template>
