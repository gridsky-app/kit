import { useAccountStore } from "@gridsky/core/runtime/stores/storeAccount"
import { useProfileStore } from "@gridsky/core/runtime/stores/storeProfile"
import { useProfileGridStore } from "@gridsky/core/runtime/stores/storeProfileGrid"
import { useProfileGridPostsStore } from "@gridsky/core/runtime/stores/storeProfileGridPosts"
import {isLogged} from "@gridsky/core/runtime/utils/utilAccount"

export const useProfilePageStore = function (handle: string) {
    return defineStore(`profile/page/${makeHandleLonger(handle)}`, () => {
        const accountStore = useAccountStore()
        const profileStore = useProfileStore(handle)
        const profileGridStore = useProfileGridStore(handle)

        const isReady = ref(false)
        const profileFeedController = ref()
        const profileGridPostsController = ref({})

        function init() {
            let shouldLoadProfileFeed = false

            profileFeedController.value = useProfileFeedStore(profileStore.profile, {
                storePostsIntoPostsKeyVal: true
            })
            profileFeedController.value.setup()

            for (let grid of profileGridStore.gridListWithExtraItems) {
                profileGridPostsController.value[grid.name] = useProfileGridPostsStore(profileStore.profile, `${profileStore.profile.did}:${grid.name}`)
                profileGridPostsController.value[grid.name].setup(grid.postsToFetch)

                if (grid.postsToFetch && grid.postsToFetch.length === 0 && !shouldLoadProfileFeed) {
                    shouldLoadProfileFeed = true
                }
            }

            if (!shouldLoadProfileFeed && isLogged() && accountStore.isAuthor(profileStore.profile)) {
                shouldLoadProfileFeed = true
            }

            if (shouldLoadProfileFeed) {
                profileFeedController.value.model.fetchList()
            }

            if (!profileGridStore.doesProfileGridExist(profileGridStore.gridActiveKey)) {
                profileGridStore.setFirstAvailableProfileGridAsProfileActiveGrid()
            }

            isReady.value = true
        }

        function loadProfilePageFeeds() {
            const isAccount = accountStore.isAuthor(profileStore.profile)

            if (isAccount) {
                if (profileGridStore.activeGridHasCustomPosts) {

                } else {
                    profileGridPostsControllerActive.value?.model.fetchList()
                }
            } else {
                if (!profileGridStore.activeGridHasCustomPosts) {
                } else {
                    profileGridPostsControllerActive.value?.model.fetchList()
                }
            }

            return true
        }

        function switchProfilePageGrid() {
            const isAccount = accountStore.isAuthor(profileStore.profile)

            if (isAccount) {

            } else {
                if (!profileGridStore.activeGridHasCustomPosts) {

                } else {
                    profileGridPostsControllerActive.value.model.fetchList()
                }
            }
        }

        const profileGridPostsControllerActive = computed(() => {
            return profileGridPostsController.value[profileGridStore.gridActive.name]
        })

        const activeModel = computed(() => {
            if (!profileGridStore.activeGridHasCustomPosts) {
                return profileFeedController.value.model
            } else {
                return profileGridPostsControllerActive.value.model
            }
        })

        return {
            isReady,
            init,
            profileFeedController,
            profileGridPostsControllerActive,
            activeModel,
            loadProfilePageFeeds,
            switchProfilePageGrid,
        }
    })()
}
