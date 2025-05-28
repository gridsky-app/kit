<script setup lang="ts">
withDefaults(defineProps<{
  type: string
  format?: string
  hideMediaContent?: boolean
}>(), {
  format: 'default'
})
</script>

<template>
  <div
    :class="[
      'gsky-media bg-background',
      `gsky-media--${type}`,
      `gsky-media--format-${format}`,
    ]"
  >
    <template v-if="!hideMediaContent">
      <suspense>
        <slot />
      </suspense>

      <slot name="menu" />

      <div class="gsky-media__actions">
        <slot name="actions" />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.gsky-media {
  position: relative;
  width: 100%;
  height: 100%;

  &--format-reel {
    aspect-ratio: 9 / 16;
  }

  &__type-icon {
    position: absolute;
    top: 12px;
    right: 15px;
    color: white;
    font-size: 14px;
    pointer-events: none;

    .mdi {
      &-play {
        font-size: 24px;
        margin-top: -2px;
        margin-right: -8px;
      }

      &-checkbox-multiple-blank {
        font-size: 17px;
        margin-top: -2px;
        margin-right: -4px;
      }
    }
  }

  &__actions {
    position: absolute;
    bottom: 10px;
    right: 10px;
    color: white;
    font-size: 14px;

    a {
      color: white;
    }

    @media (max-width: 480px) {
      right: 12px;
      font-size: 3dvw;
    }
  }
}
</style>
