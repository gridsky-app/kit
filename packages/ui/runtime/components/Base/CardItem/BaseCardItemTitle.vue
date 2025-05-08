<script setup lang="ts">
defineProps<{
  title?: string
  link?: string
}>()
</script>

<template>
  <div class="gsky-card-item-title font-weight-bold">
    <slot>
      <span
        v-if="title"
        class="text-truncate pr-6"
        v-text="title"
      />
    </slot>

    <slot
      v-if="$slots.append"
      name="append"
    />

    <nuxt-link v-if="link" :to="link" />
  </div>
</template>

<style scoped lang="scss">
.gsky-card-item-title {
  position: relative;
  display: inline-block;
  font-size: 16px;
  height: 18px;
  line-height: 22px;
  margin-top: 6px;

  a {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
</style>
