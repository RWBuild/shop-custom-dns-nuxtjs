<script setup lang="ts">
interface Props {
  image?: string;
  imageAlt?: string;
  link?: string;
  aspectRatio?: string;
}

withDefaults(defineProps<Props>(), {
  image: '/images/shop-banner.jpg',
  imageAlt: 'Shop promotional banner',
  link: '',
  aspectRatio: '21/9',
});
</script>

<template>
  <section class="w-full">
    <component
      :is="link ? resolveComponent('NuxtLink') : 'div'"
      :to="link || undefined"
      :class="{ 'cursor-pointer': link }"
      class="block"
    >
      <NuxtImg
        :src="image"
        :alt="imageAlt"
        class="h-auto w-full object-cover"
        :style="{ aspectRatio }"
        loading="eager"
        sizes="100vw"
        format="webp"
        quality="85"
        placeholder
      />
    </component>
  </section>
</template>
