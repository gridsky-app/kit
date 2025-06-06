import { useListBase } from './useListBase';
import { useListCursor } from './useListCursor';
import { useAgent } from './useAtproto';

export function useListProfileFollows(actor: string) {
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

        const response = await useAgent('auto').app.bsky.graph.getFollows({
            actor,
            cursor: cursor.value,
        });

        await baseList.appendItems({
          hasReachedEnd: !response.data['cursor'],
          items: response.data['follows'],
        })

        if (response.data['cursor']) {
          updateCursor(response.data['cursor']);
        }
    }

    async function fetchList(restart?: boolean) {
        baseList.isLoading.value = true;
        await requestItems(restart);
    }

    return _this;
}
