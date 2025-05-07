<template>
  <v-card
    :rounded="false"
    :width="480"
    :height="480"
    color="transparent"
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
  background: rgba(var(--v-theme-surface), 0.4);
  box-shadow: 0 0 0 1px rgba(var(--v-theme-on-background), 0.1);
  transition: border-radius 0.2s;
}

@media(width: 960px) and (height: 960px) {
  .v-card {
    zoom: 2;
    box-shadow: none;
    background: rgba(var(--v-theme-surface), 0.25);
    border-radius: 0 !important;
  }
}
</style>
