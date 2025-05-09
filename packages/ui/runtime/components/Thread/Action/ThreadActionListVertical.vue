<script setup lang="ts">
defineProps<{
  thread: any
  showCaption?: boolean
  showLikes?: boolean
  showLikesWithAvatar?: boolean
  showLikesCount?: boolean
  showCommentsCount?: boolean
  showDate?: boolean
  replyTruncate?: boolean
  threadCommentDialog?: boolean
}>()
</script>

<template>
  <div
    class="gsky-thread-detail__actions"
  >

    <ThreadActionButtonLike
      layout="vertical"
      :thread="thread"
      :show-count="showLikesCount"
    />

    <ThreadActionButtonComment
      layout="vertical"
      :thread="thread"
      :show-count="showCommentsCount"
    />

    <ThreadActionButtonShare
      :thread="thread"
    />

  </div>
</template>

<style scoped lang="scss">
.gsky-thread-detail__actions {
  text-align: center;

  :deep(.gsky-thread-action-button) {
    margin: 16px auto;
  }

  :deep(a) {
    display: block;
    margin: 0 auto;
    transition: color 0.5s ease-in-out;
    color: initial;

    &:active {
      color: rgb(var(--v-theme-primary));
      transition: none;
    }

    svg {
      pointer-events: none;
    }
  }
}
</style>
