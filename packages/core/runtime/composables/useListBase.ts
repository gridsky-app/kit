import {ref, computed, UnwrapRef} from 'vue';

export function useListBase<T = any>(source?: any) {
  const list = ref<T[]>([]);

  const isLoading = ref(false);
  const isRefreshing = ref(false);
  const hasReachedEnd = ref(false);

  const filterLogic = ref<((item: T) => boolean) | undefined>(undefined);
  const sortLogic = ref<((a: T, b: T) => number) | undefined>(undefined);

  const listFiltered = computed(() => {
    let items = [...list.value];

    if (filterLogic.value) {
      items = items.filter(filterLogic.value);
    }

    if (sortLogic.value) {
      items = items.sort(sortLogic.value);
    }

    return items;
  });

  function clearList() {
    isLoading.value = false;
    hasReachedEnd.value = false;

    list.value = [];
  }

  function prepareToAppendItems() {
    if (isRefreshing.value) {
      isRefreshing.value = false;

      list.value = [];
    }
  }

  async function appendItems(data: { hasReachedEnd: boolean; items: T[] }) {
    list.value.push(...data.items);
    isLoading.value = false;

    if (data.hasReachedEnd) {
      hasReachedEnd.value = true;
    }
  }

  function setFilterLogic(fn: (item: T) => boolean) {
    filterLogic.value = fn;
  }

  function resetFilterLogic() {
    filterLogic.value = undefined;
  }

  function setSortLogic(fn: (a: T, b: T) => number) {
    sortLogic.value = fn;
  }

  const isListBooting = computed(() => isLoading.value && list.value.length === 0);
  const isListEmpty = computed(() => !isLoading.value && list.value.length === 0);
  const cantLoadMoreItems = computed(() => hasReachedEnd.value);

  return {
    // state
    source,
    list,
    listFiltered,
    isLoading,
    isRefreshing,
    hasReachedEnd,

    // logic
    clearList,
    prepareToAppendItems,
    appendItems,
    setFilterLogic,
    resetFilterLogic,
    setSortLogic,

    // computed
    isListBooting,
    isListEmpty,
    cantLoadMoreItems,
  };
}
