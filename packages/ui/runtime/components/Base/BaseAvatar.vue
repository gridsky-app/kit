<script setup lang="ts">
import {getAvatarLetter} from '@gridsky/core/runtime/utils/utilString';
import {computed, ref} from 'vue';

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
  eager?: boolean
}>(), {
  border: true
})

const imageLoaded = ref(false)

const displayLetter = computed(() => {
  if (props.avatar?.letter) {
    return getAvatarLetter(props.avatar?.letter)
  }

  if (props.title) {
    return getAvatarLetter(props.title)
  }

  return ''
})

function handleImageLoad() {
  imageLoaded.value = true;
}

function handleImageError() {
  imageLoaded.value = false;
}
</script>

<template>
  <v-avatar
    class="gsky-avatar"
    :title="title"
    :size="size"
    :border="border"
  >

    <img
      v-if="avatar?.image"
      :src="avatar?.image"
      :alt="title"
      :class="{ 'image-loaded': imageLoaded }"
      @load="handleImageLoad"
      @error="handleImageError"
    />
    <Icon v-else-if="avatar?.icon?.name" v-bind="avatar?.icon"/>
    <span v-else v-text="displayLetter"/>

    <v-progress-circular
      v-if="loading"
      indeterminate
      :size="size - (border ? 2 : 0)"
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
  background-color: rgba(var(--v-theme-skeleton));
  box-shadow: inset 0 0 0 1px rgba(var(--v-border-color),var(--v-border-opacity));

  img {
    width: 100%;
    height: 100%;
    background-size: cover;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;

    &.image-loaded {
      opacity: 1;
    }
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
