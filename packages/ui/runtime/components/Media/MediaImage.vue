<script setup lang="ts">
defineProps<{
  image?: any
  aspectRatio?: string | number
  showType?: string
}>()

defineEmits(['ready'])
</script>

<template>
  <div class="gsky-media__image">
    <img
        :src="image.thumb"
        :alt="image.alt"
        draggable="false"
        @load="$emit('ready')"
        @error="$emit('ready')"
    />
  </div>
</template>

<style scoped lang="scss">
.gsky-media__image {
  height: 100%;

  img {
    width: 100%;
    object-fit: cover !important;
    aspect-ratio: v-bind('aspectRatio');
  }
}
</style>
