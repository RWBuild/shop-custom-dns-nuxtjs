<script setup lang="ts">
const { themeStyles } = useTheme();

useHead({
  style: [
    {
      innerHTML: themeStyles,
    },
  ],
});
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
