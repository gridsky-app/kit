import { useAccountGridEditorStore } from "@gridsky/core/runtime/stores/storeAccountGridEditor"

export const useAccountGridStore = defineStore("account/grid", () => {
  const accountGridEditorStore = useAccountGridEditorStore()

  const gridList: Ref<GridskyProfileRawGrid[]> = ref([])

  function setAccountGridList(grids: any) {
    gridList.value = grids

    accountGridEditorStore.resetAccountGridEditorList()
  }

  return {
    gridList,
    setAccountGridList,
  }
})
