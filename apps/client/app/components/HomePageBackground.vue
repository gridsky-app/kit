<script setup lang="ts">
defineProps<{
  enabled: boolean
}>()
</script>

<template>
  <div
    v-if="enabled"
    class="gsky-home-page-background"
  >
    <div class="gsky-home-page-background__image" />
  </div>
</template>

<style scoped lang="scss">
.gsky-home-page-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    content: '';
    background-image: var(--gsky-background-image);
    background-size: cover;
    background-position: center;
    z-index: 0;
    opacity: 0.2;
  }

  &:after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(96px);
    z-index: 0;
    content: '';
  }
}
</style>
