import { ref } from 'vue';
import { useListBase } from './useListBase';
import { useAgent } from '../composables/useAtproto';

export function useListNotification() {
  const baseList = useListBase();

  const cursor = ref<string | undefined>(undefined);

  async function requestItems() {
    const listOptions: any = {
      limit: 16,
      cursor: cursor.value,
    };

    if (baseList.isRefreshing.value) {
      cursor.value = undefined;
      listOptions.cursor = undefined;
    }

    const result = await useAgent('private')
      .app.bsky.notification.listNotifications(listOptions)
      .then((res) => res.data);

    if (result) {
      cursor.value = result.cursor;

      await baseList.appendItems({
        hasReachedEnd: !cursor.value,
        items: result['notifications'],
      });
    }

    baseList.isLoading.value = false;
  }

  async function fetchList(restart?: boolean) {
    baseList.isLoading.value = true;

    await requestItems();

    baseList.isLoading.value = false;
  }

  async function refetchList() {
    baseList.isRefreshing.value = true
    await fetchList(true)
  }

  return {
    ...baseList,
    cursor,
    requestItems,
    fetchList,
    refetchList,
  };
}
