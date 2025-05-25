import { useListBase } from '@gridsky/core/runtime/composables/useListBase';
import { useListCursor } from '@gridsky/core/runtime/composables/useListCursor';
import { useListFeedWorker } from '@gridsky/core/runtime/composables/useListFeedWorker';
import { useAgent } from '@gridsky/core/runtime/composables/useAtproto';
import { ThreadModel } from '@gridsky/core/runtime/models/ThreadModel';
import { useAccountStore } from '@gridsky/core/runtime/stores/storeAccount';

export function useListActorLikes() {
    const baseList = useListBase();
    const { cursor, resetCursor, updateCursor } = useListCursor();
    const accountStore = useAccountStore();

    const workerConfig = {
        fetcher: {
            method: 'app.bsky.feed.getActorLikes',
            options: {
                actor: accountStore.account.did,
                limit: 100,
            },
        },
        processor: {
            listKey: 'feed',
        },
        storage: {
            context: 'gridsky:common',
            name: 'ProfileLikes',
            key: accountStore.account.did,
        },
    };

    const { worker, postMessage, listenOnce } = useListFeedWorker(workerConfig);

    const _this: any = {
        ...baseList,
        fetchList,
        requestItems,
        cursor,
        worker,
    };

    async function requestItems(resetCursorFlag?: boolean) {
        if (resetCursorFlag) {
            resetCursor();
        }

        const response = await useAgent('auto').app.bsky.feed.getActorLikes({
            actor: accountStore.account.did,
            limit: 100,
            cursor: cursor.value,
        });

        if (response.data?.cursor) {
            updateCursor(response.data.cursor);
        }

        postMessage('fetch', {
            meta: {
                overrideConfig: {
                    fetcher: {
                        response,
                    },
                },
            },
        });

        return new Promise((resolve) => {
            listenOnce('fetch', async (e) => {
                await appendItems(e.data.result);
                resolve(true);
            });
        });
    }

    async function appendItems(data: { hasReachedEnd: boolean; items: any[] }) {
        baseList.prepareToAppendItems();

        let index = baseList.list.value.length;

        const threadsInstanced: ThreadModel[] = data.items.map((item: any) => {
            return new ThreadModel(item, index++);
        });

        data.items = threadsInstanced;

        await baseList.appendItems(data);
    }

    async function fetchList(restart?: boolean) {
        baseList.isLoading.value = true;
        await requestItems(restart);
    }

    return _this;
}
