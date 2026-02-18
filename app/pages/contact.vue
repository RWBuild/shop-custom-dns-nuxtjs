<script setup lang="ts">
import { mockContact } from '~/mocks';

useSeo({
  title: 'Contact Us',
  description: mockContact.hero.subtitle,
});
</script>

<template>
  <div>
    <UContainer class="py-10 sm:py-16">
      <div class="max-w-4xl">
        <h1 class="text-2xl font-bold text-gray-brand-neutral-2 sm:text-3xl">
          {{ mockContact.hero.title }}
        </h1>
        <p class="mt-2 text-gray-brand-1">
          {{ mockContact.hero.subtitle }}
        </p>

        <div class="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-6">
          <div v-for="item in mockContact.info" :key="item.id">
            <h2 class="border-b border-gray-brand-3 pb-3 text-sm font-medium text-gray-brand-2">
              {{ item.title }}
            </h2>
            <div class="mt-4 space-y-1">
              <p
                v-for="(line, index) in item.lines"
                :key="index"
                class="text-sm text-gray-brand-netural-1"
              >
                {{ line }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>
