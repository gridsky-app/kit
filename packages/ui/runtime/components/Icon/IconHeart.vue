<script setup lang="ts">
defineProps<{
  active?: boolean
  size?: number
}>()
</script>

<template>
  <Icon
      v-show="!active"
      name="mdi:cards-heart-outline"
      :size="size"
  />
  <Icon
      v-show="active"
      name="mdi:cards-heart"
      :size="size"
  />
</template>