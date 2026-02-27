<script setup lang="ts">
const { shopName, shopAddress, shopLocation, shopEmail, shopPhone } = useShopInfo();

useSeo({
  title: 'Contact Us',
  description: `Get in touch with ${shopName.value}`,
});

const contactInfo = computed(() => [
  {
    id: 'address',
    title: 'Address',
    icon: 'i-lucide-map-pin',
    lines: [shopAddress.value, shopLocation.value].filter(Boolean),
  },
  {
    id: 'email',
    title: 'Email',
    icon: 'i-lucide-mail',
    lines: shopEmail.value ? [shopEmail.value] : [],
    href: shopEmail.value ? `mailto:${shopEmail.value}` : undefined,
  },
  {
    id: 'phone',
    title: 'Phone',
    icon: 'i-lucide-phone',
    lines: shopPhone.value ? [shopPhone.value] : [],
    href: shopPhone.value ? `tel:${shopPhone.value}` : undefined,
  },
].filter(item => item.lines.length > 0));
</script>

<template>
  <div>
    <UContainer class="py-10 sm:py-16">
      <div class="max-w-4xl">
        <h1 class="text-2xl font-bold text-gray-brand-neutral-2 sm:text-3xl">
          Contact Us
        </h1>
        <p class="mt-2 text-gray-brand-1">
          We'd love to hear from you. Get in touch with us.
        </p>

        <div class="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-6">
          <div v-for="item in contactInfo" :key="item.id">
            <h2 class="border-b border-gray-brand-3 pb-3 text-sm font-medium text-gray-brand-2 flex items-center gap-2">
              <UIcon :name="item.icon" class="size-4" />
              {{ item.title }}
            </h2>
            <div class="mt-4 space-y-1">
              <component
                :is="item.href ? 'a' : 'p'"
                v-for="(line, index) in item.lines"
                :key="index"
                :href="item.href"
                class="block text-sm text-gray-brand-netural-1"
                :class="item.href ? 'hover:text-primary transition-colors' : ''"
              >
                {{ line }}
              </component>
            </div>
          </div>
        </div>

        <div v-if="contactInfo.length === 0" class="mt-10 text-center text-gray-500">
          <p>Contact information coming soon.</p>
        </div>
      </div>
    </UContainer>
  </div>
</template>
