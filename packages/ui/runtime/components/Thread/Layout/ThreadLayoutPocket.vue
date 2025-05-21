<script setup lang="ts">
defineProps<{
  thread: ThreadModel
}>()

defineEmits(['albumSwiperReady'])
</script>

<template>
  <div class="gsky-thread-layout-pocket">
    <v-card class="gsky-thread-layout-pocket__media">
      <Media
        :thread="thread"
        :album="{direction: 'vertical'}"
        :force-aspect-ratio="1"
        @albumSwiperReady="swiper => $emit('albumSwiperReady', swiper)"
      />
    </v-card>
  </div>
</template>

<style scoped lang="scss">
.gsky-thread-layout-pocket__media {
  height: 100%;
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  border-bottom: none;

  :deep(swiper-container) {
    aspect-ratio: 1;
  }
}
</style>
