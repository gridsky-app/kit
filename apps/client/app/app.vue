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
  --gsky-background-image: url('https://cdn.bsky.app/img/feed_thumbnail/plain/did:plc:fgnp656eaylvgokf3s573244/bafkreiesg7zuzp7ni6zx3bv6hsplbvdwycdfjo3tlimdtdewikon3vi76a@jpeg');
}
</style>
