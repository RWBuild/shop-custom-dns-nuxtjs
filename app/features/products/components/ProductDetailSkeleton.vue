<script setup lang="ts"></script>

<template>
  <div class="py-6 sm:py-10">
    <div class="mb-6 flex items-center gap-1.5">
      <div class="h-3 w-10 animate-pulse rounded bg-gray-200" />
      <div class="h-3 w-3 animate-pulse rounded bg-gray-200" />
      <div class="h-3 w-14 animate-pulse rounded bg-gray-200" />
      <div class="h-3 w-3 animate-pulse rounded bg-gray-200" />
      <div class="h-3 w-20 animate-pulse rounded bg-gray-200" />
    </div>

    <div class="grid gap-6 lg:grid-cols-2 lg:gap-10">
      <div class="flex flex-col gap-4">
        <div class="aspect-square animate-pulse rounded-2xl bg-gray-200" />
        <div class="flex gap-3">
          <div
            v-for="i in 4"
            :key="i"
            class="h-16 w-16 animate-pulse rounded-lg bg-gray-200 sm:h-20 sm:w-20"
          />
        </div>
      </div>

      <div class="flex flex-col">
        <div class="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
        <div class="mt-2 h-5 w-24 animate-pulse rounded bg-gray-200" />
        <div class="mt-3 h-3.5 w-full animate-pulse rounded bg-gray-200" />
        <div class="mt-1.5 h-3.5 w-2/3 animate-pulse rounded bg-gray-200" />

        <div class="mt-5 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <div class="h-3 w-14 animate-pulse rounded bg-gray-200" />
            <div class="h-8 w-28 animate-pulse rounded-full bg-gray-200" />
          </div>
          <div class="h-8 w-28 animate-pulse rounded-full bg-gray-200" />
        </div>

        <div class="my-5 border-t border-gray-200" />

        <div class="space-y-1.5">
          <div class="h-3 w-full animate-pulse rounded bg-gray-200" />
          <div class="h-3 w-full animate-pulse rounded bg-gray-200" />
          <div class="h-3 w-3/4 animate-pulse rounded bg-gray-200" />
        </div>

        <div class="mt-5">
          <div class="h-4 w-28 animate-pulse rounded bg-gray-200" />
          <div class="mt-2 space-y-1.5">
            <div class="flex justify-between">
              <div class="h-3 w-20 animate-pulse rounded bg-gray-200" />
              <div class="h-3 w-14 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
