<script setup lang="ts">
defineProps<{
  active?: boolean
  size?: number
}>()
</script>

<template>
  <Icon
      v-show="!active"
      name="lucide:book-plus"
      :size="size"
  />
  <Icon
      v-show="active"
      name="lucide:book-check"
      :size="size"
  />
</template>