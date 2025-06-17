<script setup lang="ts">
import {computed} from "vue"

const props = withDefaults(
  defineProps<{
    profile?: any
    size?: number
    icon?: {
      name?: string;
      size?: number;
      class?: string;
    }
    border?: boolean
    editable?: boolean
    loading?: boolean
    link?: boolean
  }>(),
  {
    size: 120,
    border: true,
  },
)

const avatar = computed(() => {
  return {
    image: props.profile?.avatar,
    letter: props.profile?.handle,
    icon: props.icon,
  }
})
</script>

<template>
  <BaseAvatar
    class="gsky-profile-avatar"
    :avatar="avatar"
    :size="size"
    :loading="loading"
    :border="border"
  >
    <slot/>
  </BaseAvatar>
</template>

<style scoped lang="scss">

</style>
