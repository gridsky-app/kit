export function useThreadChunk(index: number, threads: ThreadModel[]) {
  const renderedThreads = ref(0)
  const rendered = ref(false)

  const _height = ref(undefined)
  const height = computed(() => {
    if (!_height.value) {
      return undefined
    }

    return `${_height.value}px`
  })

  function setHeight(value: number, forceUpdate?: boolean) {
    if (!_height.value || forceUpdate) {
      _height.value = value
    }
  }

  function recalculateHeight(elementContainer: HTMLElement) {
    setHeight(elementContainer.scrollHeight, true)
  }

  return {
    index,
    threads,
    rendered,
    renderedThreads,
    incrementChunkMediaLoaded() {
      renderedThreads.value++;

      if (renderedThreads.value === this.threads.length) {
        rendered.value = true;
      }
    },

    // height
    height,
    setHeight,
    recalculateHeight,
  };
}
