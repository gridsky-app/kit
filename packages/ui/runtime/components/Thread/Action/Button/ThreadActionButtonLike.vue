<script setup lang="ts">
defineProps<{
  thread: any
  showCount?: boolean
}>()
</script>

<template>
  <ThreadActionButton
    class="cursor-pointer"
  >
    <template v-slot:icon>
      <a :class="['cursor-pointer', {'text-primary': thread.isLiked}]">
        <IconHeart
          :active="thread.isLiked"
          :size="28"
        />
      </a>
    </template>
    <template v-slot:count>
      <ThreadActionButtonCount
        v-if="showCount && thread.post.likeCount > 0"
        :count="thread.post.likeCount"
        class="mr-1"
      />
    </template>
  </ThreadActionButton>
</template>

<style scoped lang="scss">

</style>
