<script setup lang="ts">
withDefaults(defineProps<{
  layout: 'vertical'|'horizontal'
}>(), {
  layout: 'horizontal'
})
</script>

<template>
  <div :class="['gsky-thread-action-button', `gsky-thread-action-button--${layout}`]">
    <v-row no-gutters>
      <v-col class="flex-grow-1">
        <slot name="icon"/>
      </v-col>
      <v-col
          v-if="$slots.count"
          class="flex-grow-0 font-weight-bold pl-1"
          align-self="center"
      >
        <slot name="count"/>
      </v-col>
    </v-row>
    <slot/>
  </div>
</template>

<style scoped lang="scss">
.gsky-thread-action-button {
  width: max-content;

  :deep(.iconify) {
    vertical-align: middle;
  }

  &--vertical {
    .v-row {
      flex-direction: column;

      .font-weight-bold {
        margin-left: 1px;
      }
    }
  }
}
</style>
