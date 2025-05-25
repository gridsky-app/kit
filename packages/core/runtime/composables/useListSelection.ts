import { ref } from 'vue';
import { ThreadModel } from '@gridsky/core/runtime/models/ThreadModel';

export function useListSelection(baseList: any) {
  const selectedPostUrisToMarkAsSelected = ref<string[]>([]);

  function setPreSelectedPostsList(uris: string[]) {
    selectedPostUrisToMarkAsSelected.value = uris;
  }

  function applyPreSelectionOnThreads() {
    baseList.list.value.forEach((thread: ThreadModel) => {
      thread.selection.set(selectedPostUrisToMarkAsSelected.value.includes(thread.post.uri));
    });
  }

  function applyFilterLogicByNotSelected() {
    return baseList.list.value.filter((thread: ThreadModel) => {
      return !thread.selection.selected.value
    });
  }

  return {
    selectedPostUrisToMarkAsSelected,
    setPreSelectedPostsList,
    applyPreSelectionOnThreads,
    applyFilterLogicByNotSelected,
  };
}
