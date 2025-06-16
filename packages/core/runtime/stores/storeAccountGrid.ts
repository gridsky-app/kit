export const useAccountGridStore = defineStore("account/grid", () => {
  const gridList: Ref<GridskyProfileRawGrid[]> = ref([])

  function setAccountGridList(grids: any) {
    gridList.value = grids
  }

  async function fetchAccountGridList() {
    // todo riagganciarsi prendendo i dati dal profileStore
    gridList.value = []
  }

  return {
    gridList,
    setAccountGridList,
    fetchAccountGridList,
  }
})
