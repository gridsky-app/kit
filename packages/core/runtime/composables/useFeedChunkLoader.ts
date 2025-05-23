export function useFeedChunkLoader(model: any) {
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

        return chunks.value[0]?.threads.length === chunks.value[0]?.state.renderedThreads
    })

    const isLastChunkRendered = computed(() => {
        if (chunks.value.length === 0) {
            return false
        }

        return chunks.value[chunks.value.length - 1]?.state.rendered
    })

    const stillHasMoreChunksToLoad = computed(() => {
        return listChunkStart.value <= model.list.length
    })

    async function preloadNextChunk(origin?: string, setChunkAsAlreadyRendered = false): Promise<boolean> {
        if (model.list.length < listChunkEnd.value && !model.cantLoadMoreItems) {
            return model.fetchList()
        }

        const chunkThreads = model.list.slice(listChunkStart.value, listChunkEnd.value)

        function createChunkObject(chunkIndex, chunkThreads) {
            return {
                id: chunkIndex,
                threads: chunkThreads,
                state: reactive({
                    renderedThreads: 0,
                    rendered: false,
                }),
                incrementChunkMediaLoaded() {
                    this.state.renderedThreads++;

                    if (this.state.renderedThreads === this.threads.length) {
                        this.state.rendered = true;
                    }
                },
            };
        }

        const chunk = createChunkObject(chunkIndex.value, chunkThreads)

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
        model.clearList()
        clearChunks()

        loading.boot = true

        if (isRebooting) {
            await new Promise((resolve) => setTimeout(resolve, 800))
            await model.refetchList()
        }
    }

    function clearChunks() {
        chunks.value = []
        chunkIndex.value = 0
        listChunkStart.value = 0
    }

    const areThereAnyItemsToLoad = computed(() => {
        if (listChunkStart.value >= model.list.length) {
            return false
        }

        return true
    })

    const canShowSpinner = computed(() => {
        if (loading.boot) {
            return false
        }

        if (model.list.length === 0) {
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

        if (model.list.length === 0) {
            return false
        }

        return true
    })

    const isEmpty = computed(() => {
        return chunks.value.length === 0
    })

    const infiniteLoader = computed(() => {
        return {
            options: {
                root: getMainElement(),
                rootMargin: `${window.innerHeight * 3}px`
            }
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
