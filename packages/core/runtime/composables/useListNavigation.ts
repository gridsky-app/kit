import { ref, computed } from 'vue';

export function useListNavigation(listContext: {
  list: Ref<any[]>;
  fetchList?: () => Promise<any>;
  isLoading?: { value: boolean };
}) {
  const activeIndex = ref(-1);
  const indexOffsetLoadMoreBeforeEndReached = 3;

  const hasNavigatorReachedEnd = computed(() => {
    return activeIndex.value === listContext.list.value.length - 1;
  });

  const activeItem = computed(() => {
    return activeIndex.value >= 0 ? listContext.list.value[activeIndex.value] : undefined;
  });

  function setActiveIndex(index: number) {
    activeIndex.value = index;
  }

  function resetActiveIndex() {
    activeIndex.value = -1;
  }

  function findListIndex(thread: any) {
    return listContext.list.value.findIndex((t: any) => t.post?.cid === thread.post?.cid);
  }

  function prevItem() {
    if (activeIndex.value > 0) {
      activeIndex.value--;
      return true;
    }
    return false;
  }

  async function nextItem() {
    // Stop if already at the end
    if (hasNavigatorReachedEnd.value) return false;

    // If we're at the last loaded item and more can be loaded
    if (
      activeIndex.value === listContext.list.value.length - 1 &&
      !listContext.isLoading?.value &&
      listContext.fetchList
    ) {
      await listContext.fetchList();

      // Check again if end was reached after loading
      if (activeIndex.value === listContext.list.value.length - 1) {
        return false;
      }
    }

    // Preload more items in advance
    if (
      activeIndex.value === listContext.list.value.length - indexOffsetLoadMoreBeforeEndReached &&
      !listContext.isLoading?.value &&
      listContext.fetchList
    ) {
      listContext.fetchList(); // preload, no await
    }

    activeIndex.value++;
    return true;
  }

  return {
    activeIndex,
    activeItem,
    hasNavigatorReachedEnd,
    setActiveIndex,
    resetActiveIndex,
    findListIndex,
    prevItem,
    nextItem,
  };
}
