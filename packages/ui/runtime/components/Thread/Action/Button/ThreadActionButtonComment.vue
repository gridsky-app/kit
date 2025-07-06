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
      <a>
        <Icon
            name="iconamoon:comment"
            class="mr-n1"
            :size="26"
        />
      </a>
    </template>
    <template v-slot:count>
      <ThreadActionButtonCount
          v-if="showCount && thread.post.replyCount > 0"
          :count="thread.post.replyCount"
          class="mr-1"
      />
    </template>
  </ThreadActionButton>
</template>

<style scoped lang="scss">
:deep(.iconify) {
  vertical-align: -6px;
}
</style>
