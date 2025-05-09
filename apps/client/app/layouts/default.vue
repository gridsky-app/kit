<script setup lang="ts">
import {useAppPreferencesStore} from "../stores/storeAppPreferences";

const appPreferencesStore = useAppPreferencesStore()
</script>

<template>
  <NuxtPage/>

  <HomePageBackground
    v-if="$route.name === 'index'"
    :enabled="appPreferencesStore.homePageBackground"
  />
</template>

<style lang="scss">
.gsky-pocket {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}
</style>
