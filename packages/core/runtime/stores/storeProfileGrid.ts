import {makeHandleLonger} from "@gridsky/core/runtime/utils/utilProfile"
import {useAccountStore} from '@gridsky/core/runtime/stores/storeAccount'

// todo migrate to profileDid or just pass the profile
import {workerSlugify} from "@gridsky/core/runtime/workers/utils/utilWorkerString";
import {isLogged} from "@gridsky/core/runtime/utils/utilAccount";
import {useThreadDraftListStore} from "./storeThreadDraftList";

export function useProfileGridStore(profileHandle: string) {
  return defineStore(`profile/grid/${makeHandleLonger(profileHandle)}`, () => {
    const accountStore = useAccountStore()

    const gridList = ref<GridskyProfileRawGrid[]>([])
    const gridActiveKey = ref<string>('')

    const gridListWithExtraItems = computed(() => {
      const threadDraftListStore = useThreadDraftListStore()

      let gridListSpecialPrepend = []

      if (isLogged() && accountStore.account.handle === makeHandleLonger(profileHandle) && threadDraftListStore.threadDraftList.length > 0) {
        gridListSpecialPrepend.push({
          label: 'Drafts',
          name: 'drafts',
          layout: '1-1',
          posts: []
        })
      }

      return [
        ...gridListSpecialPrepend,
        ...gridList.value.map(rawGrid => {
          return {
            ...rawGrid,

            // posts will be just posts
            // and should be fetched with getPosts
            postsToFetch: rawGrid.posts
              ? rawGrid.posts?.filter((postUri: string) => postUri.startsWith('at://'))
              : [],

            // drafts are gridsky drafts
            // and should be fetched using a custom call
            draftsToFetch: rawGrid.posts
              ? rawGrid.posts?.filter((postUri: string) => postUri.startsWith('draft://'))
              : []
          }
        })
      ]
    })

    const gridActive = computed(() => {
      return (

        // determine active raw grid
        gridListWithExtraItems.value.find(grid => {
          return grid.name === gridActiveKey.value
        }) || {
          name: gridActiveKey.value,
          posts: [],
        }

      ) as GridskyProfileRawGrid
    })

    const gridActiveIndex: ComputedRef<number> = computed(() => {
      return gridListWithExtraItems.value.findIndex(grid => {
        return grid.name === gridActiveKey.value
      }) || 0
    })

    const activeGridHasCustomPosts = computed(() => {
      if (!gridActive.value) {
        return false
      }

      return gridActive.value.posts && (Array.isArray(gridActive.value.posts) && gridActive.value.posts.length > 0)
    })

    function setProfileGridList(grids: any) {
      gridList.value = grids
    }

    function doesProfileGridExist(gridName: string) {
      return gridList.value.find(g => g.name === gridName)
    }

    function setFirstAvailableProfileGridAsProfileActiveGrid() {
      setProfileActiveGrid(gridList.value[0].name)
    }

    function setProfileActiveGrid(name: string | undefined) {
      if (!name) {
        return
      }

      gridActiveKey.value = name
    }

    return {
      gridList,
      gridListWithExtraItems,
      gridActiveKey,
      gridActiveIndex,
      gridActive,
      activeGridHasCustomPosts,
      setProfileGridList,
      setProfileActiveGrid,
      doesProfileGridExist,
      setFirstAvailableProfileGridAsProfileActiveGrid,
    }
  })()
}
