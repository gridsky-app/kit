import { useListBase } from './useListBase';
import { useListCursor } from './useListCursor';
import { useAgent } from './useAtproto';

export function useListProfileFollowers(actor: string) {
  const baseList = useListBase();
  const { cursor, resetCursor, updateCursor } = useListCursor();

  const _this: any = {
    ...baseList,
    cursor,
    fetchList,
    requestItems,
  };

  async function requestItems(reset?: boolean) {
    if (reset) resetCursor();

    const response = await useAgent('auto').app.bsky.graph.getFollowers({
      actor,
      cursor: cursor.value,
    });

    if (response.cursor) {
      updateCursor(response.cursor);
    }

    await baseList.appendItems({
      hasReachedEnd: !cursor.value,
      items: response.data['followers'],
    })
  }

  async function fetchList(restart?: boolean) {
    baseList.isLoading.value = true;
    await requestItems(restart);
  }

  return _this;
}
