<script setup lang="ts">
import {computed} from "vue";

const props = defineProps<{
  remaining: number,
}>()

const formattedRemainingTime = computed(() => {
  const minutes = Math.floor(props.remaining / 60)
  const seconds = Math.floor(props.remaining % 60)
      .toString()
      .padStart(2, '0')
  return `${minutes}:${seconds}`
})
</script>

<template>
  <v-fade-transition>
    <div
        v-if="props.remaining > 4"
        class="gsky-media__video__duration text-overline"
        v-text="formattedRemainingTime"
    />
  </v-fade-transition>
</template>

<style scoped lang="scss">
.gsky-media__video__duration {
  position: absolute;
  top: 8px;
  right: 14px;
}
</style>
