<script setup lang="ts">
defineProps<{
  thread: any
  showCaption?: boolean
  showLikes?: boolean
  showLikesWithAvatar?: boolean
  showCommentsCount?: boolean
  showDate?: boolean
  replyTruncate?: boolean
  threadCommentDialog?: boolean
}>()
</script>

<template>
  <div
      ref="threadActionList"
      class="gsky-thread-detail__actions"
  >
    <v-row no-gutters class="gsky-thread-detail__actions__buttons">
      <v-col class="flex-grow-0">

        <v-breadcrumbs style="margin-left: -2px;">
          <v-breadcrumbs-item>
            <ThreadActionButtonLike
                :thread="thread"
            />
          </v-breadcrumbs-item>
          <v-breadcrumbs-item class="ml-3">
            <ThreadActionButtonComment
                :thread="thread"
                :show-comments-count="showCommentsCount"
            />
          </v-breadcrumbs-item>
          <v-breadcrumbs-item class="ml-2">
            <ThreadActionButtonShare
                :thread="thread"
            />
          </v-breadcrumbs-item>
        </v-breadcrumbs>

      </v-col>
      <v-col class="flex-grow-1">
      </v-col>
      <v-col class="flex-grow-0">

        <v-breadcrumbs class="mr-n1">
          <v-breadcrumbs-item>
            <ThreadActionButtonSave
                :thread="thread"
            />
          </v-breadcrumbs-item>
        </v-breadcrumbs>

      </v-col>
    </v-row>
  </div>
</template>

<style scoped lang="scss">
.gsky-thread-detail__actions {
  &__buttons {
    padding: var(--gsky-post-actions-padding-y) 0;

    .v-breadcrumbs {
      padding: 0;

      &-item {
        padding: 0;
      }
    }

    :deep(a) {
      display: flex;
      transition: color 0.5s ease-in-out;

      &:active {
        color: rgb(var(--v-theme-primary));
        transition: none;
      }

      svg {
        pointer-events: none;
      }
    }
  }
}
</style>
