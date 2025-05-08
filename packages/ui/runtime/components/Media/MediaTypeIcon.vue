<script setup lang="ts">
import {getMediaTypeIcon} from "@gridsky/core/runtime/utils/utilMedia"

const props = defineProps<{
  type: string
}>()

const mediaType = getMediaTypeIcon(props.type)
</script>

<template>
  <div class="gsky-media__type text-white">
    <Icon
      :name="mediaType"
    />
  </div>
</template>

<style scoped lang="scss">
.gsky-media__type {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1;

  span {
    width: 25px;
    height: 25px;
  }

  @media(max-width: 599px) {
    top: 5px;
    right: 9px;

    span {
      width: 16px !important;
    }
  }
}
</style>
