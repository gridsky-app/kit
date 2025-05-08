<script setup lang="ts">
import {useAppPreferencesStore} from "./stores/storeAppPreferences";

const appPreferencesStore = useAppPreferencesStore()
</script>

<template>
  <v-app>
    <AppToolGuides :enabled="appPreferencesStore.helperGuides" />
    <NuxtLayout />
  </v-app>
</template>

<style lang="scss">
:root {
  --gsky-background-image: url('https://cdn.bsky.app/img/feed_thumbnail/plain/did:plc:xdkwk57ojt7qs5v2ztoulxgi/bafkreib5pldzoecvxclsjndrgg6rwa4lhgi5hgiywzlaxb3pvkijwxqixi@jpeg');
}
</style>
