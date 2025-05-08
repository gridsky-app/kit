<script setup lang="ts">
import {useAppPreferencesStore} from "../stores/storeAppPreferences";

const appPreferencesStore = useAppPreferencesStore()
</script>

<template>
  <v-card
    :rounded="appPreferencesStore.layoutRounded"
    :width="480"
    :height="480"
    color="black"
  >
    <NuxtPage/>
  </v-card>
</template>

<style scoped lang="scss">
.v-card {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 1px rgba(var(--v-theme-on-background), 0.1);
  transition: border-radius 0.2s;
  z-index: 1;
}

@media(width: 960px) and (height: 960px) {
  .v-card {
    zoom: 2;
    box-shadow: none;
    border-radius: 0 !important;
  }
}
</style>
