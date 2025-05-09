<script setup lang="ts">
defineProps<{
  thread: any
}>()
</script>

<template>
  <a>
    <Icon
        name="lucide:bookmark" :size="27"
        :class="['cursor-pointer', {'text-primary': thread.isSaved}]"
    />
  </a>
</template>

<style scoped lang="scss">
a {
  position: relative;
}
</style>
