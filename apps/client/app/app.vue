<script setup lang="ts">
import {useAppPreferencesStore} from "./stores/useAppPreferencesStore";

const appPreferencesStore = useAppPreferencesStore()
</script>

<template>
  <v-app>
    <AppToolGuides :enabled="appPreferencesStore.helperGuides" />
    <NuxtLayout />
  </v-app>
</template>

<style lang="scss">
.v-application {
  background: rgb(0, 0, 0) !important;
}
</style>
