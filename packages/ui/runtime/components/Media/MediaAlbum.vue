<script setup lang="ts">
defineProps<{
  thread: any
  aspectRatio?: number
  cover?: boolean
  navigation?: boolean
  mousewheel?: boolean
}>()

const emit = defineEmits(['ready'])

function onMediaImageReady(index: number) {
  if (index === 0) {
    emit('ready')
  }
}
</script>

<template>
  <div class="gsky-media__album">
    <swiper-container
        direction="horizontal"
        :navigation="navigation && $vuetify.display.smAndUp"
        :pagination="navigation"
        :mousewheel="mousewheel"
        loop="true"
    >
      <swiper-slide
          v-for="(imageSrc, index) in thread.post.embed.images"
          v-memo="imageSrc" :key="index"
      >
        <MediaImage
            :image="imageSrc"
            :key="`media:${imageSrc}`"
            :aspect-ratio="aspectRatio"
            @ready="onMediaImageReady(index)"
        />
      </swiper-slide>
    </swiper-container>
  </div>
</template>

<style scoped lang="scss">
.gsky-media__album {
  &:hover {
    swiper-container::part(button-prev),
    swiper-container::part(button-next),
    swiper-container::part(pagination) {

      &:not(.swiper-button-disabled) {
        opacity: 0 !important;
      }

      opacity: 1 !important;
      transition-delay: 0s;
    }
  }
}

swiper-container {
  max-height: 100%;

  @media(min-width: 960px) {
    &::part(button-prev),
    &::part(button-next),
    &::part(pagination) {
      opacity: 0;
      transition: 0.2s ease-in-out;
      transition-delay: 1.5s;
    }
  }
}

swiper-slide {
  align-content: center;
  align-self: stretch;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>
