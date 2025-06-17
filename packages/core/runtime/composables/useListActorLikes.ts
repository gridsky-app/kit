import { useListBase } from '@gridsky/core/runtime/composables/useListBase';
import { useListCursor } from '@gridsky/core/runtime/composables/useListCursor';
import { useListFeedWorker } from '@gridsky/core/runtime/composables/useListFeedWorker';
import { useAgent } from '@gridsky/core/runtime/composables/useAtproto';
import { ThreadModel } from '@gridsky/core/runtime/models/ThreadModel';
import { useAccountStore } from '@gridsky/core/runtime/stores/storeAccount';
import {useThreadModel} from "@gridsky/core/runtime/composables/useThreadModel";
import {useListFeedChunkLoader} from "@gridsky/core/runtime/composables/useListFeedChunkLoader";
import {useListNavigation} from "@gridsky/core/runtime/composables/useListNavigation";

export function useListActorLikes() {
    const accountStore = useAccountStore();

    const workerConfig = {
      parser: {
        listKey: 'feed',
        actions: {
          resetCursor: false
        },
      },
      storage: {
        context: 'gridsky:common',
        name: 'ProfileLikes',
        key: accountStore.account.did,
      },
    };

    const baseList = useListBase();
    const { cursor, resetCursor, updateCursor } = useListCursor();
    const { worker, postMessage, listenOnce } = useListFeedWorker(workerConfig);

    const _this: any = {
        ...baseList,
        fetchList,
        refetchList,
        requestItems,
        cursor,
        worker,
    };

    const chunkLoader = useListFeedChunkLoader(_this);
    _this.chunkLoader = chunkLoader

    const navigation = useListNavigation(_this)
    _this.navigation = navigation

    async function requestItems(reset?: boolean) {
        if (reset) {
            resetCursor();
        }

        workerConfig.parser.actions.resetCursor = !!reset

        const response = await useAgent('auto').app.bsky.feed.getActorLikes({
            actor: accountStore.account.did,
            limit: 100,
            cursor: cursor.value,
        });

        if (response.data && response.data.cursor) {
            updateCursor(response.data.cursor);
        }

        postMessage({
          type: 'process',
          config: workerConfig,
          response
        });

        return new Promise((resolve) => {
            listenOnce('processed', async (e) => {
                await appendItems(e.data.result);
                chunkLoader.preloadNextChunk('FeedModel');
                resolve(true);
            });
        });
    }

    async function appendItems(data: { hasReachedEnd: boolean; items: any[] }) {
        baseList.prepareToAppendItems()

        // convert each item in ThreadModel and populate list
        const threadsInstanced: ThreadModel[] = []

        let index = baseList.list.value.length

        data.items.forEach((thread: any) => {
          const threadInstance = useThreadModel(thread, index);
          threadsInstanced.push(threadInstance);
          index++
        })

        // overwrite items with instanced items
        data.items = threadsInstanced

        // call parent method to append lists
        await baseList.appendItems(data)
    }

    async function fetchList(restart?: boolean) {
      baseList.isLoading.value = true;
      await requestItems(restart);
      baseList.isLoading.value = false;
    }

    async function refetchList() {
      await fetchList(true);
    }

    return _this;
}
