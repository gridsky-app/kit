<script setup lang="ts">
defineProps<{
  layout: string
}>()
</script>

<template>
  <Icon
      :name="layout === 'grid' ? 'lucide:rectangle-vertical' : 'lucide:grid-3x3'"
      :size="16"
      class="mr-2"
      style="vertical-align: -3px;"
  />
</template>