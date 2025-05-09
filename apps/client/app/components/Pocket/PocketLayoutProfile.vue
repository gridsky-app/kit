<script setup lang="ts">
import {useAppPageStore} from "../../stores/storeAppPage";

const appPageStore = useAppPageStore()
</script>

<template>
  <PocketLayout>

    <v-fade-transition>
      <AppAnimationGrid
        v-if="!appPageStore.pageLoaded"
      />
    </v-fade-transition>

    <div
      v-if="appPageStore.pageLoaded"
      class="gsky-pocket__inner-card"
    >

      <slot name="header" />

      <div class="mt-2">
        <slot />
      </div>
    </div>

  </PocketLayout>
</template>

<style scoped lang="scss">
:deep(.v-progress-linear__background) {
  opacity: 1 !important;
}

.gsky-pocket__inner-card {
  position: absolute;
  bottom: 0;
  left: 64px;
  right: 64px;
  aspect-ratio: 1;
  //overflow: initial;
}
</style>
