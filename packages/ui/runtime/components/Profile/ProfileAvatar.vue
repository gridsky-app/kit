<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    profile?: any
    size?: number
    iconSize?: number
    border?: boolean
    editable?: boolean
    link?: boolean
  }>(),
  {
    size: 120,
  },
)

const avatar = {
  image: props.profile.avatar,
  letter: props.profile.handle,
}
</script>

<template>
  <BaseAvatar
    class="gsky-profile-avatar"
    :avatar="avatar"
    :size="size"
  />
</template>

<style scoped lang="scss">

</style>
