<script setup lang="ts">
import {getAvatarLetter} from '@gridsky/core/runtime/utils/utilString';
import {computed} from 'vue';

const props = withDefaults(defineProps<{
  title?: string;
  avatar?: {
    letter?: string;
    image?: string;
    icon?: {
      name?: string;
      size?: number;
      class?: string;
    };
  }
  size?: number;
  link?: string;
  loading?: boolean
  border?: boolean
}>(), {
  border: true
});

const displayLetter = computed(() => {
  if (props.avatar?.letter) {
    return getAvatarLetter(props.avatar?.letter)
  }

  if (props.title) {
    return getAvatarLetter(props.title)
  }

  return ''
});
</script>

<template>
  <v-avatar
    class="gsky-avatar"
    :title="title"
    :size="size"
    :border="border"
  >

    <v-img v-if="avatar?.image" :src="avatar?.image" :alt="title" />
    <Icon v-else-if="avatar?.icon?.name" v-bind="avatar?.icon"/>
    <span v-else v-text="displayLetter"/>

    <v-progress-circular
      v-if="loading"
      indeterminate
      :size="size - 1"
      :width="2"
    />

    <slot/>

    <nuxt-link
      v-if="link" :to="link"
    />

  </v-avatar>
</template>

<style scoped lang="scss">
.gsky-avatar {
  img {
    width: 100%;
    height: 100%;
    background-size: cover;
  }

  a {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .v-progress-circular {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
  }
}
</style>
