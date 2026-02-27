<script setup lang="ts">
const { themeStyles } = useTheme();

useHead({
  style: [
    {
      key: 'app-theme',
      innerHTML: themeStyles.value,
      tagPosition: 'bodyClose',
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
