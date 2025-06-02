import { useListBase } from '@gridsky/core/runtime/composables/useListBase';
import { useListCursor } from '@gridsky/core/runtime/composables/useListCursor';
import { useListNavigation } from '@gridsky/core/runtime/composables/useListNavigation';
import { useListFeedWorker } from '@gridsky/core/runtime/composables/useListFeedWorker';
import { useAgent } from '@gridsky/core/runtime/composables/useAtproto';
import { ThreadModel } from '@gridsky/core/runtime/models/ThreadModel';
import {useListFeedChunkLoader} from "@gridsky/core/runtime/composables/useListFeedChunkLoader";
import {useThreadModel} from "@gridsky/core/runtime/composables/useThreadModel";

export function useListFeedTimeline(source: { feed: string }) {
    const workerConfig = {
        parser: {
            listKey: 'feed',
            actions: {}
        },
        storage: {
            context: 'gridsky:common',
            name: 'FeedTimeline',
            key: source.feed,
        },
    };


    const baseList = useListBase(source);
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

        const response = await useAgent('auto').getTimeline({
            limit: 100,
            cursor: cursor.value,
        });

        if (response.data?.cursor) {
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
          threadsInstanced.push(
            useThreadModel(thread, index)
          )
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
