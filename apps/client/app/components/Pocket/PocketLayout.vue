<script setup lang="ts">
import {useAppPageStore} from "../../stores/storeAppPage";
import {useAppPreferencesStore} from "../../stores/storeAppPreferences";

const appPageStore = useAppPageStore()
const appPreferencesStore = useAppPreferencesStore()
</script>

<template>
  <div class="gsky-pocket">

    <v-card
      :rounded="appPreferencesStore.layoutRounded"
      :width="480"
      :height="480"
      class="gsky-pocket__card"
      color="black"
    >
      <slot/>
    </v-card>

    <v-fade-transition>
      <AppPageLoader
          v-if="$route.meta.showLoader && !appPageStore.pageLoaded"
          :message="appPageStore.pageLoadingMessage"
      />
    </v-fade-transition>

  </div>
</template>

<style scoped lang="scss">
.gsky-pocket {
  .v-card {
    border-radius: 72px;
    transition: border-radius 0.2s;
    box-shadow: 0 0 0 1px rgba(var(--v-theme-on-background), 0.2), 0 8px 32px 0 rgba(0, 0, 0, 0.08);

    @media(width: 960px) and (height: 960px) {
      zoom: 2;
      box-shadow: none;
      border-radius: 0 !important;
    }
  }
}
</style>
