<script setup lang="ts">
const currentYear = new Date().getFullYear();

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
];
</script>

<template>
  <footer>
    <div class="bg-gray-900 text-gray-300">
      <UContainer>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 py-8 sm:py-10 lg:py-12">
          <div>
            <h3
              class="text-[11px] sm:text-xs font-semibold text-white mb-3 sm:mb-4 uppercase tracking-wider"
            >
              Quick Links
            </h3>
            <ul class="space-y-2 sm:space-y-2.5">
              <li v-for="link in quickLinks" :key="link.to">
                <NuxtLink
                  :to="link.to"
                  class="inline-block py-0.5 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <h3
              class="text-[11px] sm:text-xs font-semibold text-white mb-3 sm:mb-4 uppercase tracking-wider"
            >
              Information
            </h3>
            <ul class="space-y-2 sm:space-y-2.5">
              <li>
                <a
                  href="mailto:guhemba@guhemba.rw"
                  class="inline-block py-0.5 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Customer Support
                </a>
              </li>
            </ul>
          </div>

          <div
            class="col-span-2 sm:col-span-1 flex justify-center sm:justify-end items-start pt-4 sm:pt-0 border-t border-gray-800 sm:border-0"
          >
            <a href="https://guhemba.rw" target="_blank">
              <NuxtImg
                src="/images/powered-by-guhemba.svg"
                alt="Powered by Guhemba"
                width="140"
                height="28"
                class="w-30 sm:w-35 lg:w-40 h-auto"
              />
            </a>
          </div>
        </div>
      </UContainer>
    </div>

    <div class="bg-gray-950 text-gray-400">
      <UContainer>
        <div class="flex justify-center items-center py-3 sm:py-3.5 text-[10px] sm:text-[11px]">
          <p class="text-center">
            &copy; {{ currentYear }} All rights reserved. Developed by
            <a
              href="https://rwandabuildprogram.com/"
              target="_blank"
              class="text-gray-300 font-medium hover:text-primary transition-colors"
            >
              RwandaBuildProgram
            </a>
          </p>
        </div>
      </UContainer>
    </div>
  </footer>
</template>
