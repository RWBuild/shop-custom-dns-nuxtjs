<script setup lang="ts">
import { mockAbout } from '~/mocks';

useSeo({
  title: 'About Us',
  description: mockAbout.hero.subtitle,
});
</script>

<template>
  <div>
    <UContainer class="py-10 sm:py-16">
      <div class="mx-auto max-w-2xl">
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">About Our Store</h1>
        <p class="mt-2 text-gray-500">
          {{ mockAbout.hero.subtitle }}
        </p>

        <div class="mt-10 space-y-10">
          <section v-for="section in mockAbout.sections" :key="section.id">
            <h2 class="text-lg font-semibold text-gray-900">
              {{ section.title }}
            </h2>
            <p class="mt-3 text-sm leading-relaxed text-gray-600">
              {{ section.content }}
            </p>
          </section>
        </div>
      </div>
    </UContainer>
  </div>
</template>
