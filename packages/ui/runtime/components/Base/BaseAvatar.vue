<script setup lang="ts">
import {getAvatarLetter} from '@gridsky/core/runtime/utils/utilString';
import {computed} from 'vue';

const props = defineProps<{
  title?: string;
  letter?: string;
  image?: string;
  icon?: {
    name?: string;
    size?: number;
  };
  link?: string;
}>();

const displayLetter = computed(() => {
  if (props.letter) {
    return props.letter
  }

  if (props.title) {
    return getAvatarLetter(props.title)
  }

  return ''
});
</script>

<template>
  <v-avatar :title="title">

    <Icon v-if="icon?.name" v-bind="icon"/>
    <img v-else-if="image" :src="image" :alt="title" loading="lazy"/>
    <span v-else v-text="displayLetter"/>

    <nuxt-link
      v-if="link" :to="link"
    />

  </v-avatar>
</template>

<style scoped lang="scss">
img {
  width: 100%;
  height: 100%;
  background-size: cover;
}
</style>
