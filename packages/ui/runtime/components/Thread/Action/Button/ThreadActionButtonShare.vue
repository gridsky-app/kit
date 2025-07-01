<script setup lang="ts">
import {routeThread} from "@gridsky/core/runtime/utils/utilRoute"
import ThreadActionButton from "./ThreadActionButton.vue";
//const postModalShareStore = usePostModalShareStore()

const props = defineProps<{
  thread: any
}>()

function onShareClick() {
  //postModalShareStore.openDialog(props.thread)
}
</script>

<template>
  <a :href="routeThread(thread)" @click.prevent="onShareClick">
    <ThreadActionButton>
      <Icon
        name="lucide:send" :size="25"
        class="cursor-pointer"
      />
    </ThreadActionButton>
  </a>
</template>

<style scoped lang="scss">
a {
  position: relative;
}
</style>
