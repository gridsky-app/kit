import { useAccountStore } from "@gridsky/core/runtime/stores/storeAccount"
import { useAccountGridStore } from "@gridsky/core/runtime/stores/storeAccountGrid"
import { useProfileGridStore } from "@gridsky/core/runtime/stores/storeProfileGrid"
import { useProfilePageStore } from "@gridsky/core/runtime/stores/storeProfilePage"
import { useThreadDraftListStore } from "@gridsky/core/runtime/stores/storeThreadDraftList"
import {isLogged} from "@gridsky/core/runtime/utils/utilAccount"
import {generateId} from "@gridsky/core/runtime/utils/utilString"

export const useAccountGridEditorStore = defineStore("account/grid/editor", () => {
    const accountStore = useAccountStore()
    const accountGridStore = useAccountGridStore()

    const gridListTemp = ref([])

    const accountGridEditorModal = ref<boolean>(false)
    const gridEditorActiveKey = ref<string>('')

    const hasChanges = computed(() => {
        return !deepEqual(accountGridStore.gridList, gridListTemp.value)
    })

    // enable selectable/sortable posts grid
    const postsSelectionEditor = ref(false)

    const tabs = computed(() => {
        return gridListTemp.value.map(value => {
            return value
        })
    })

    function resetAccountGridEditorList() {
        setAccountGridEditorList(
            deepClone(accountGridStore.gridList)
        )

        if (gridListTemp.value.length === 0) {
            addAccountGridEditorListItem()
        }
    }

    const accountGridEditorActiveConfig = computed(() => {
        if (!gridEditorActiveKey.value) {
            return gridListTemp.value[0]
        }

        return gridListTemp.value.find(grid => {
            return grid.id === gridEditorActiveKey.value
        })
    })

    function setAccountGridEditorList(data: any) {
        gridListTemp.value = data
    }

    function setAccountGridEditorActiveKey(idKey: string) {
        gridEditorActiveKey.value = idKey
    }

    function openAccountGridEditor(idKey: string = '') {
        accountGridEditorModal.value = true
        setAccountGridEditorActiveKey(idKey)
    }

    function addAccountGridEditorListItem() {
        const id = generateId(8)

        gridListTemp.value.push({
            id,
            name: id,
            label: 'Posts',
            icon: '',
            layout: '1-1',
            posts: [],
        })
    }

    async function updateGridConfig() {
        await updateAccountGridList(gridListTemp.value)

        const profileGridStore = useProfileGridStore(accountStore.account.handle)
        const previousGridEditorActiveKey = profileGridStore.accountGridEditorActiveConfigKey

        profileGridStore.setProfileGridList(gridListTemp.value)
        profileGridStore.setProfileActiveGrid(previousGridEditorActiveKey)

        accountGridStore.gridList = gridListTemp.value

        // initialize new grid posts stores if a grid has been added
        useProfilePageStore(accountStore.account.handle).init()
    }

    async function setAccountActiveGridPostList(postUris: string[]) {
        const threadDraftListStore = useThreadDraftListStore()

        accountGridEditorActiveConfig.value.posts = postUris.filter((uri) => {
            if (uri.startsWith('draft://')) {
                return threadDraftListStore.isValidDraftUri(uri)
            }
            return true
        })

        await updateGridConfig()
    }

    async function profileLayoutGridSelect(idKey: string) {
        if (isLogged()) {
            setAccountGridEditorActiveKey(idKey)
            postsSelectionEditor.value = false
        }
    }

    async function replaceUriInAllGrids(oldUri: string, newUri: string) {
        resetAccountGridEditorList()

        gridListTemp.value = gridListTemp.value.map(grid => {
            const updatedGrid = { ...grid }

            if (Array.isArray(updatedGrid.posts)) {
                updatedGrid.posts = updatedGrid.posts.map((uri: string) =>
                    uri === oldUri ? newUri : uri
                )
            }

            return updatedGrid
        })

        await updateGridConfig()
    }

    async function removeUriFromAllGrids(uriToRemove: string) {
        resetAccountGridEditorList()

        gridListTemp.value = gridListTemp.value.map(grid => {
            const updatedGrid = { ...grid }

            if (Array.isArray(updatedGrid.posts)) {
                updatedGrid.posts = updatedGrid.posts.filter(
                    (uri: string) => uri !== uriToRemove
                )
            }

            return updatedGrid
        })

        await updateGridConfig()
    }

    return {
        hasChanges,
        tabs,
        gridListTemp,
        gridEditorActiveKey,
        accountGridEditorActiveConfig,
        postsSelectionEditor,
        resetAccountGridEditorList,
        setAccountGridEditorList,
        accountGridEditorModal,
        openAccountGridEditor,
        setAccountGridEditorActiveKey,
        setAccountActiveGridPostList,
        updateGridConfig,
        profileLayoutGridSelect,

        addAccountGridEditorListItem,

        replaceUriInAllGrids,
        removeUriFromAllGrids,
    }
})
