<script setup lang="ts">
import {onMounted} from "vue";
import {useRoute, useSeoMeta} from "nuxt/app";
import {ThreadModel} from "@gridsky/core/runtime/models/ThreadModel"
import {useProfileStore} from "@gridsky/core/runtime/stores/storeProfile"
import {makeHandleShort} from "@gridsky/core/runtime/utils/utilProfile"
import {formatLocaleTimeAgo} from "@gridsky/core/runtime/utils/utilTimeAgo"
import {useAppPageStore} from "../../../stores/storeAppPage";

const route = useRoute()

const profileHandle: string = String(route.params.handle)
const profileStore = useProfileStore(profileHandle)
const appPageStore = useAppPageStore()

const thread = new ThreadModel(
  `at://${profileStore.did}/app.bsky.feed.post/${route.params.cid}`
)

onMounted(async () => {
  appPageStore.setLoadingMessage('loading profile...')
  await profileStore.loadProfile()

  appPageStore.setLoadingMessage('loading thread...')
  await thread.getThread()

  appPageStore.pageLoaded = true
})

useSeoMeta({
  title: `@${makeHandleShort(route.params.handle)}`,
})

definePageMeta({
  showLoader: true,
})
</script>

<template>
  <PocketLayoutProfile>

    <template #header>
      <ProfileCardItem
        v-if="appPageStore.pageLoaded"
        :profile="profileStore.profile"
        :time="formatLocaleTimeAgo(thread.post.record.createdAt)"
        show-time
      />
    </template>

    <ThreadLayoutPocket
      :thread="thread"
    />

  </PocketLayoutProfile>
</template>

<style scoped lang="scss">

</style>
