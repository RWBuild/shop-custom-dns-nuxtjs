<script setup lang="ts">
interface Props {
  class?: string;
}

defineProps<Props>();
</script>

<template>
  <div
    class="animate-pulse rounded bg-gray-200"
    :class="$props.class"
  />
</template>
