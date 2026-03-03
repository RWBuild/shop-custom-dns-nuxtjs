<script setup lang="ts">
const { shopName, aboutContent } = useShopInfo();
const { sanitizeHtml } = useSanitize();

const sanitizedAboutContent = computed(() => sanitizeHtml(aboutContent.value));

useSeo({
  title: 'About Us',
  description: `Learn more about ${shopName.value}`,
});
</script>

<template>
  <div>
    <UContainer class="py-10 sm:py-16">
      <div class="mx-auto max-w-2xl">
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">About {{ shopName }}</h1>

        <div class="mt-10">
          <!-- eslint-disable vue/no-v-html -- Content is sanitized with DOMPurify -->
          <div
            v-if="sanitizedAboutContent"
            class="prose prose-sm prose-gray max-w-none text-gray-600 leading-relaxed"
            v-html="sanitizedAboutContent"
          />
          <!-- eslint-enable vue/no-v-html -->
          <p v-else class="text-sm text-gray-500">
            Welcome to our store. We're committed to providing you with the best products and service.
          </p>
        </div>
      </div>
    </UContainer>
  </div>
</template>
