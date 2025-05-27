import { ref } from 'vue';
import { ThreadModel } from '@gridsky/core/runtime/models/ThreadModel';

export function useListSelection(listContext: any) {
  const selectedPostUrisToMarkAsSelected = ref<string[]>([]);

  function setPreSelectedPostsList(uris: string[]) {
    selectedPostUrisToMarkAsSelected.value = uris;
  }

  function applyPreSelectionOnThreads() {
    listContext._list.value.forEach((thread: ThreadModel) => {
      thread.selection.set(
        selectedPostUrisToMarkAsSelected.value.includes(thread.post.uri)
      );
    });
  }

  function applyFilterLogicByNotSelected() {
    listContext.setFilterLogic((thread: ThreadModel) => {
      return !thread.selection.selected;
    })
  }

  return {
    selectedPostUrisToMarkAsSelected,
    setPreSelectedPostsList,
    applyPreSelectionOnThreads,
    applyFilterLogicByNotSelected,
  };
}
