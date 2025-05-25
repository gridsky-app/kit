import { ref, watch } from 'vue';

export function useListCursor() {
  const cursor = ref<string | number | undefined>(undefined);

  function resetCursor() {
    cursor.value = undefined;
  }

  function updateCursor(newCursor: string | number | undefined) {
    cursor.value = newCursor;
  }

  return {
    cursor,
    resetCursor,
    updateCursor,
  };
}
