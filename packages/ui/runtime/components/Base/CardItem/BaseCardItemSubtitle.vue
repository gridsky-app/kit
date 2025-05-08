<script setup lang="ts">
defineProps<{
  subtitle?: string
  link?: string
}>()
</script>

<template>
  <div class="gsky-card-item-subtitle">
    <slot>
      <span
        v-if="subtitle"
        class="text-truncate opacity-80"
        v-text="subtitle"
      />
    </slot>

    <nuxt-link v-if="link" :to="link" />
  </div>
</template>

<style scoped lang="scss">
.gsky-card-item-subtitle {
  position: relative;
  display: inline-block;
  height: 18px;
  line-height: 20px;
  margin-bottom: 6px;

  a {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
</style>
