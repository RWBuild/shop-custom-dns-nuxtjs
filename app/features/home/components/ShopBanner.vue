<script setup lang="ts">
interface Props {
  image?: string;
  imageAlt?: string;
  link?: string;
  /** Image focal point: 'top' | 'center' | 'bottom' - where to focus when cropping */
  focalPoint?: 'top' | 'center' | 'bottom';
  /** Height preset: 'sm' | 'md' | 'lg' | 'xl' */
  height?: 'sm' | 'md' | 'lg' | 'xl';
  /** Show gradient overlay for better text readability */
  overlay?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  image: '',
  imageAlt: 'Shop promotional banner',
  link: '',
  focalPoint: 'center',
  height: 'md',
  overlay: false,
});

const { bannerUrl, shopName } = useShopInfo();

// Use prop image if provided, otherwise use shop banner from content
const bannerImage = computed(() => props.image || bannerUrl.value || '/images/shop-banner.jpg');
const bannerAlt = computed(() => props.imageAlt || `${shopName.value} banner`);

const heightClasses = {
  sm: 'h-32 sm:h-40 md:h-48 lg:h-56',
  md: 'h-40 sm:h-48 md:h-56 lg:h-72',
  lg: 'h-48 sm:h-56 md:h-72 lg:h-80',
  xl: 'h-56 sm:h-72 md:h-80 lg:h-96',
};

const focalPointClasses = {
  top: 'object-top',
  center: 'object-center',
  bottom: 'object-bottom',
};
</script>

<template>
  <section class="w-full">
    <component
      :is="link ? resolveComponent('NuxtLink') : 'div'"
      :to="link || undefined"
      class="relative block w-full overflow-hidden sm:rounded-xl"
      :class="[heightClasses[height], { 'cursor-pointer': link }]"
    >
      <NuxtImg
        :src="bannerImage"
        :alt="bannerAlt"
        class="absolute inset-0 h-full w-full object-cover"
        :class="focalPointClasses[focalPoint]"
        loading="eager"
        sizes="100vw"
        format="webp"
        quality="85"
        placeholder
      />

      <div
        v-if="overlay"
        class="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent"
      />

      <div v-if="$slots.default" class="absolute inset-0 flex items-center">
        <div class="w-full px-4 sm:px-6 lg:px-8">
          <slot />
        </div>
      </div>
    </component>
  </section>
</template>
