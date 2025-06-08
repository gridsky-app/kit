export function useListFeedChunkLoader(baseList: any) {
    const CHUNK_SIZE = 15

    const chunkIndex = ref<number>(0)
    const listChunkStart = ref<number>(0)
    const chunks = ref<ThreadChunk[]>([])

    const loading = reactive({
        boot: true,
        more: false,
    })

    const listChunkEnd = computed(() => {
        return listChunkStart.value + CHUNK_SIZE
    })

    const isFirstChunkRendered = computed(() => {
        if (chunks.value.length === 0) {
            return false
        }

        return chunks.value[0]?.threads.length === chunks.value[0]?.renderedThreads.value
    })

    const isLastChunkRendered = computed(() => {
      if (chunks.value.length === 0) {
            return false
        }

        return chunks.value[chunks.value.length - 1]?.rendered
    })

    const stillHasMoreChunksToLoad = computed(() => {
        return listChunkStart.value <= baseList.list.value.length
    })

    async function preloadNextChunk(origin?: string, setChunkAsAlreadyRendered = false): Promise<boolean> {
        if (baseList.list.value.length < listChunkEnd.value && !baseList.cantLoadMoreItems.value) {
          return baseList.fetchList()
        }

        const chunkThreads = baseList.list.value.slice(listChunkStart.value, listChunkEnd.value)

        function createChunkObject(chunkIndex, chunkThreads) {
            const renderedThreads = ref(0)
            const rendered = ref(false)

            return {
                id: chunkIndex,
                threads: chunkThreads,
                rendered,
                renderedThreads,
                incrementChunkMediaLoaded() {
                    renderedThreads.value++;

                    if (renderedThreads.value === this.threads.length) {
                        rendered.value = true;
                    }
                },
            };
        }

        const chunk: ThreadChunk = createChunkObject(chunkIndex.value, chunkThreads)

        chunkThreads.forEach(thread => {
            thread.setChunk(chunk)
        })

        chunks.value.push(chunk)

        listChunkStart.value = listChunkEnd.value

        chunkIndex.value++

        loading.boot = false
        loading.more = false

        return true
    }

    async function boot(isRebooting?: boolean) {
        baseList.clearList()
        clearChunks()

        loading.boot = true

        if (isRebooting) {
            await new Promise((resolve) => setTimeout(resolve, 800))
            await baseList.refetchList()
        } else {
            baseList.fetchList()
        }
    }

    function clearChunks() {
        chunks.value = []
        chunkIndex.value = 0
        listChunkStart.value = 0
    }

    const areThereAnyItemsToLoad = computed(() => {
        if (listChunkStart.value >= baseList.list.value.length) {
            return false
        }

        return true
    })

    const canShowSpinner = computed(() => {
        if (loading.boot) {
            return false
        }

        if (baseList.list.value.length === 0) {
            return false
        }

        if (!isLastChunkRendered.value) {
            return false
        }

        return true
    })

    const canLoadMore = computed(() => {
        if (loading.boot) {
            return false
        }

        if (loading.more) {
            return false
        }

        if (!isLastChunkRendered.value) {
            return false
        }

        if (stillHasMoreChunksToLoad.value) {
            return true
        }

        if (baseList.list.value.length === 0) {
            return false
        }

        return true
    })

    const isEmpty = computed(() => {
        return chunks.value.length === 0
    })

    const infiniteLoader = computed(() => {
        return {
          /*
           options: {
                root: getMainElement(),
                rootMargin: `${window.innerHeight * 3}px`
            }
           */
        }
    })

    return {
        chunks,
        loading,
        isEmpty,
        boot,
        preloadNextChunk,
        clearChunks,
        infiniteLoader,
        isFirstChunkRendered,
        isLastChunkRendered,
        areThereAnyItemsToLoad,
        canShowSpinner,
        canLoadMore,
    }
}
