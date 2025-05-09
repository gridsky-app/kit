<script setup lang="ts">
defineProps<{
  thread: ThreadModel
}>()
</script>

<template>
  <div class="gsky-thread-layout-pocket">
    <v-card class="gsky-thread-layout-pocket__media" rounded="xl">
      <Media
        :thread="thread"
      />
    </v-card>

    <ThreadActionListVertical
      :thread="thread"
      show-comments-count
      show-likes-count
    />
  </div>
</template>

<style scoped lang="scss">
.gsky-thread-layout-pocket__media {
  height: 100%;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  border-bottom: none;
}

:deep(.gsky-thread-detail__actions) {
  position: absolute;
  right: -64px;
  bottom: 8px;
  width: 64px;
  text-align: center;
}
</style>
