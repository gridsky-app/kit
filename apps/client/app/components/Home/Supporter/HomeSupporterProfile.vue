<script setup lang="ts">
defineProps<{
  profile: BskyProfile
}>()
</script>

<template>
  <BaseAvatar
    :rounded="false"
    :avatar="{ image: profile.avatar }"
    :size="60"
  />
</template>
