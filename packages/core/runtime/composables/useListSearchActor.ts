import { useListBase } from './useListBase';
import { useListCursor } from './useListCursor';
import { useAgent } from './useAtproto';

export function useListSearchActor() {
    const baseList = useListBase();

    const { cursor, resetCursor, updateCursor } = useListCursor();

    let query = '';

    function setQuery(newQuery: string) {
        query = newQuery;
        resetCursor();
        baseList.clearList();
    }

    async function requestItems() {
        if (!query) return;

        const response = await useAgent('auto').app.bsky.actor.searchActors({
            q: query,
            limit: 5,
            cursor: cursor.value,
        });

        if (response.data?.cursor) {
            updateCursor(response.data.cursor);
        }

        await baseList.appendItems({
          hasReachedEnd: true,
          items: response.data.actors,
        });
    }

    async function fetchList() {
        baseList.isLoading.value = true;
        await requestItems();
        baseList.isLoading.value = false;
    }

    async function runSearch() {
        setQuery(query)
        await requestItems()
    }

    return {
      ...baseList,
      cursor,
      setQuery,
      fetchList,
      requestItems,
      runSearch,
    };
}
