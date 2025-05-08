<script setup lang="ts">
import {computed} from "vue";
import {makeHandleShort, routeProfile} from "@gridsky/core/runtime/utils/utilProfile"

const props = withDefaults(defineProps<{
  profile: any
  time?: string
  showTime?: boolean
  showAvatar?: boolean
  showDisplayName?: boolean
  showFollowButton?: boolean
  showProfileMenu?: boolean
  link?: boolean
  linkFull?: boolean
}>(), {
  link: true,
  showAvatar: true
})

const subtitle = computed(() => {
  if (props.showDisplayName) {
    return props.profile.displayName
  }

  if (props.showTime) {
    return props.time
  }

  return undefined
})
</script>

<template>
  <BaseCardItem
    :avatar="{ image: profile.avatar, letter: profile.handle }"
    :title="makeHandleShort(profile.handle)"
    :subtitle="subtitle"
    :link="routeProfile(profile)"
    link-avatar
  >

    <template #append>

      <slot name="append"/>

    </template>

  </BaseCardItem>
</template>
