<script setup lang="ts">
import {useMediaVolumeStore} from "@gridsky/core/runtime/stores/useMediaVolumeStore"

const mediaVolumeStore = useMediaVolumeStore()
</script>

<template>
  <v-btn
      icon class="gsky-media__volume text-white" size="x-small"
      @click="mediaVolumeStore.toggleMute"
  >
    <Icon
        v-if="!mediaVolumeStore.muted"
        name="lucide:volume-2" :size="14"
    />
    <Icon
        v-else
        name="lucide:volume-x" :size="14"
    />
  </v-btn>
</template>

<style scoped lang="scss">
.gsky-media__volume {
  position: absolute;
  bottom: 16px;
  right: 16px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
  z-index: 1;
}
</style>
