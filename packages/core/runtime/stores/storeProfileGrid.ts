import {makeHandleLonger} from "@gridsky/core/runtime/utils/utilProfile"

export function useProfileGridStore(profileHandle: string) {
    return defineStore(`profile/grid/${makeHandleLonger(profileHandle)}`, () => {

        const gridList = ref<GridskyProfileRawGrid[]>([])
        const gridActiveKey = ref<string>('')

        const gridActive = computed(() => {
            // fetch current raw grid
            const rawGrid = (

                // determine active raw grid
                gridList.value.find(grid => {
                    return grid.name === gridActiveKey.value
                }) || {
                    name: gridActiveKey.value,
                    posts: [],
                }

            ) as GridskyProfileRawGrid

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

        const gridActiveIndex: ComputedRef<number> = computed(() => {
            return gridList.value.findIndex(grid => {
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

            setProfileActiveGrid(grids[0].name)
        }

        function setProfileActiveGrid(name: string | undefined) {
            if (!name) {
                return
            }

            gridActiveKey.value = name
        }

        return {
            gridList,
            gridActiveKey,
            gridActiveIndex,
            gridActive,
            activeGridHasCustomPosts,
            setProfileGridList,
            setProfileActiveGrid,
        }
    })()
}
