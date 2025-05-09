<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
  <div
    class="gsky-pocket__loader text-subtitle-1"
  >
    <v-row no-gutters>
      <v-col class="flex-grow-0 mr-4" align-self="center">

        <v-progress-circular indeterminate :size="24" style="margin-top: -1px;"/>

      </v-col>
      <v-col align-self="center">

        <span
          class="opacity-50"
          v-text="message"
        />

      </v-col>
    </v-row>
  </div>
</template>

<style scoped lang="scss">
.gsky-pocket__loader {
  position: absolute;
  top: 24px;
  left: calc(100% + 32px);
  width: 400px;
  z-index: 2;
}
</style>
