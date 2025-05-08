<script setup lang="ts">
import {getAvatarLetter} from '@gridsky/core/runtime/utils/utilString';
import {computed} from 'vue';

const props = defineProps<{
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
  link?: string;
}>();

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
    border
  >

    <Icon v-if="avatar?.icon?.name" v-bind="avatar?.icon"/>
    <img v-else-if="avatar?.image" :src="avatar?.image" :alt="title" loading="lazy"/>
    <span v-else v-text="displayLetter"/>

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
}
</style>
