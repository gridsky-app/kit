import { useListBase } from './useListBase';
import { useListCursor } from './useListCursor';
import { useListFeedWorker } from './useListFeedWorker'; // puoi rinominare in useListWorker se ti serve generico
import { useAgent } from './useAtproto';

export function useListSearchActor() {
    const baseList = useListBase();

    const workerConfig = {
        parser: {
            listKey: 'actors',
        },
        storage: {
            context: 'gridsky:common',
            name: 'ActorsSearch',
            key: '',
        },
    };

    const { cursor, resetCursor, updateCursor } = useListCursor();
    const { worker, postMessage, listenOnce } = useListFeedWorker(workerConfig);

    const _this: any = {
        ...baseList,
        cursor,
        worker,
        setQuery,
        fetchList,
        requestItems,
    };

    let query = '';

    function setQuery(newQuery: string) {
        query = newQuery;
        workerConfig.storage.key = newQuery; // override per cache/storage
        resetCursor();
        baseList.clearList();
    }

    async function requestItems() {
        if (!query) return;

        const response = await useAgent('auto').app.bsky.actor.searchActors({
            q: query,
            limit: 10,
            cursor: cursor.value,
        });

        if (response.data?.cursor) {
            updateCursor(response.data.cursor);
        }

        postMessage('process', {
            config: workerConfig,
            response,
        });

        return new Promise((resolve) => {
            listenOnce('processed', async (e) => {
                await baseList.appendItems(e.data.result);
                resolve(true);
            });
        });
    }

    async function fetchList() {
        baseList.isLoading.value = true;
        await requestItems();
    }

    return _this;
}
