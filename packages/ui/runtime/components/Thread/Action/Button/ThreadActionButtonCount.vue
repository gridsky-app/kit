<script setup lang="ts">
defineProps<{
  count: number
}>()
</script>

<template>
  <div
      class="font-weight-bold"
      v-text="count"
  />
</template>
