<script setup lang="ts">
import {useAppPreferencesStore} from "../stores/storeAppPreferences";

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
      <NuxtPage/>
    </v-card>

    <AppPageLoader
      v-if="$route.meta.showLoader"
    />

  </div>
</template>

<style scoped lang="scss">
.gsky-pocket {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;

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
