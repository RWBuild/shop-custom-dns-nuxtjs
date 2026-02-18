<script setup lang="ts">
import PhotoSwipe from 'photoswipe';
import 'photoswipe/style.css';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

interface MediaItem {
  url: string;
  type: 'image' | 'video';
  poster?: string;
}

interface Props {
  images: string[];
  alt?: string;
}

const props = withDefaults(defineProps<Props>(), {
  alt: 'Product image',
});

const activeIndex = ref(0);
const videoPlayerRef = ref<HTMLVideoElement | null>(null);
const plyrInstance = ref<Plyr | null>(null);

const mediaItems = computed<MediaItem[]>(() => {
  const items = props.images.map((url) => {
    const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(url) || url.includes('video');
    return {
      url,
      type: isVideo ? 'video' : 'image',
      poster: isVideo
        ? props.images.find((img) => !/\.(mp4|webm|ogg|mov)$/i.test(img) && !img.includes('video'))
        : undefined,
    };
  }) as MediaItem[];

  return items.sort((a, b) => {
    if (a.type === 'video' && b.type !== 'video') return -1;
    if (a.type !== 'video' && b.type === 'video') return 1;
    return 0;
  });
});

const activeMedia = computed(() => mediaItems.value[activeIndex.value] || mediaItems.value[0]);

const imageItems = computed(() => mediaItems.value.filter((m) => m.type === 'image'));

function selectMedia(index: number) {
  if (plyrInstance.value) {
    plyrInstance.value.pause();
  }
  activeIndex.value = index;
}

function previousMedia() {
  if (plyrInstance.value) {
    plyrInstance.value.pause();
  }
  activeIndex.value = activeIndex.value > 0 ? activeIndex.value - 1 : mediaItems.value.length - 1;
}

function nextMedia() {
  if (plyrInstance.value) {
    plyrInstance.value.pause();
  }
  activeIndex.value = activeIndex.value < mediaItems.value.length - 1 ? activeIndex.value + 1 : 0;
}

async function getImageDimensions(src: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => resolve({ w: 1200, h: 1200 });
    img.src = src;
  });
}

async function openLightbox() {
  if (activeMedia.value.type === 'video') return;

  const items = await Promise.all(
    imageItems.value.map(async (media) => {
      const { w, h } = await getImageDimensions(media.url);
      return { src: media.url, w, h };
    })
  );

  const currentImageIndex = imageItems.value.findIndex((m) => m.url === activeMedia.value.url);

  const lightbox = new PhotoSwipe({
    dataSource: items,
    index: Math.max(0, currentImageIndex),
    bgOpacity: 0.95,
    showHideAnimationType: 'zoom',
    pswpModule: () => import('photoswipe'),
  });

  lightbox.init();
}

function initVideoPlayer(autoplay: boolean = false) {
  if (videoPlayerRef.value && !plyrInstance.value) {
    plyrInstance.value = new Plyr(videoPlayerRef.value, {
      controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
      resetOnEnd: true,
      autoplay,
      muted: autoplay,
    });

    if (autoplay) {
      plyrInstance.value.on('ready', () => {
        plyrInstance.value?.play();
      });
    }
  } else if (plyrInstance.value && autoplay) {
    plyrInstance.value.play();
  }
}

function destroyVideoPlayer() {
  if (plyrInstance.value) {
    plyrInstance.value.destroy();
    plyrInstance.value = null;
  }
}

watch(activeMedia, (newMedia, oldMedia) => {
  if (oldMedia?.type === 'video') {
    destroyVideoPlayer();
  }

  if (newMedia.type === 'video') {
    nextTick(() => {
      initVideoPlayer(true);
    });
  }
});

onMounted(() => {
  if (activeMedia.value.type === 'video') {
    nextTick(() => {
      initVideoPlayer(true);
    });
  }
});

onUnmounted(() => {
  destroyVideoPlayer();
});

const placeholderImage = 'https://placehold.co/600x600/f3f6f8/7493b2?text=No+Image';

function getThumbnail(media: MediaItem): string {
  if (media.type === 'video') {
    return media.poster || placeholderImage;
  }
  return media.url;
}

function isVideo(media: MediaItem): boolean {
  return media.type === 'video';
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
      <div
        v-if="activeMedia.type === 'video'"
        class="h-full w-full"
      >
        <video
          ref="videoPlayerRef"
          class="h-full w-full object-contain"
          :poster="activeMedia.poster || placeholderImage"
          playsinline
        >
          <source
            :src="activeMedia.url"
            type="video/mp4"
          />
        </video>
      </div>

      <button
        v-else
        type="button"
        class="h-full w-full cursor-zoom-in"
        @click="openLightbox"
      >
        <NuxtImg
          :src="activeMedia.url || placeholderImage"
          :alt="alt"
          class="h-full w-full object-cover transition-transform duration-300"
          format="webp"
          quality="85"
          placeholder
        />
      </button>

      <div
        v-if="activeMedia.type === 'image'"
        class="pointer-events-none absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white"
      >
        <UIcon
          name="i-heroicons-magnifying-glass-plus"
          class="size-5"
        />
      </div>

      <template v-if="mediaItems.length > 1">
        <button
          type="button"
          class="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition-all hover:bg-white hover:shadow-lg"
          @click.stop="previousMedia"
        >
          <UIcon
            name="i-heroicons-chevron-left"
            class="size-5"
          />
        </button>
        <button
          type="button"
          class="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition-all hover:bg-white hover:shadow-lg"
          @click.stop="nextMedia"
        >
          <UIcon
            name="i-heroicons-chevron-right"
            class="size-5"
          />
        </button>
      </template>

      <div
        v-if="mediaItems.length > 1"
        class="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white"
      >
        {{ activeIndex + 1 }} / {{ mediaItems.length }}
      </div>
    </div>

    <div
      v-if="mediaItems.length > 1"
      class="flex gap-3 overflow-x-auto pb-1"
    >
      <button
        v-for="(media, index) in mediaItems"
        :key="index"
        type="button"
        class="relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-lg transition-all sm:h-20 sm:w-20"
        :class="[
          activeIndex === index
            ? 'ring-2 ring-primary ring-offset-2'
            : 'opacity-60 hover:opacity-100',
        ]"
        @click="selectMedia(index)"
      >
        <NuxtImg
          :src="getThumbnail(media)"
          :alt="`${alt} thumbnail ${index + 1}`"
          class="h-full w-full object-cover"
          format="webp"
          quality="60"
          width="80"
          height="80"
        />
        <div
          v-if="isVideo(media)"
          class="absolute inset-0 flex items-center justify-center bg-black/30"
        >
          <UIcon
            name="i-heroicons-play"
            class="size-6 text-white"
          />
        </div>
      </button>
    </div>
  </div>
</template>

<style>
.plyr {
  --plyr-color-main: var(--color-primary, #00a1de);
  --plyr-video-background: #f3f6f8;
  height: 100%;
}

.plyr__video-wrapper {
  height: 100%;
}

.plyr video {
  height: 100%;
  object-fit: contain;
}

.plyr__control--overlaid {
  background: var(--plyr-color-main);
}

.plyr__control--overlaid:hover {
  background: var(--plyr-color-main);
  opacity: 0.9;
}
</style>
