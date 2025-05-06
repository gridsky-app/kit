<script setup lang="ts">
defineProps<{
  active?: boolean
  size?: number
}>()
</script>

<template>
  <Icon
      v-show="!active"
      name="lucide:pin"
      style="margin-top: 1px;"
      :size="size"
  />
  <Icon
      v-show="active"
      name="lucide:pin-off"
      style="margin-top: 1px;"
      :size="size"
  />
</template>