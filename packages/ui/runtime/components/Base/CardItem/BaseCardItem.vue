<script setup lang="ts">
import BaseAvatar from "../BaseAvatar.vue";

withDefaults(defineProps<{
  title?: string
  subtitle?: string
  avatar: false | {
    image?: string
    letter?: string
    icon?: {
      name?: string
      size?: number
    }
  }
  link?: string
  linkFull?: boolean
  linkAvatar?: boolean
}>(), {
  linkAvatar: true
})
</script>

<template>
  <div class="gsky-card-item">

    <v-row no-gutters>

      <v-col v-if="avatar" class="gsky-card-item__avatar flex-grow-0 mr-2" align-self="center">

        <slot name="avatar">
          <BaseAvatar
            :avatar="avatar"
            :link="linkAvatar ? link : undefined"
          />
        </slot>

      </v-col>

      <v-col class="gsky-card-item__content flex-grow-1">

        <BaseCardItemTitle
          :title="title"
          :link="!linkFull ? link : undefined"
        >

          <template v-if="$slots.title">
            <slot name="title"/>
          </template>

          <template #append>
            <slot name="title-append"/>
          </template>

        </BaseCardItemTitle>

        <BaseCardItemSubtitle
          :subtitle="subtitle"
          :link="!linkFull ? link : undefined"
        >

          <template v-if="$slots.subtitle">
            <slot name="subtitle"/>
          </template>

        </BaseCardItemSubtitle>

      </v-col>

      <v-col v-if="$slots.append" class="gsky-card-item__append flex-grow-0">

        <slot name="append" />

      </v-col>

    </v-row>

    <nuxt-link
      v-if="linkFull" :to="link"
    />

  </div>
</template>

<style scoped lang="scss">
.gsky-card-item {
  position: relative;
  min-height: 48px;

  a {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
</style>
