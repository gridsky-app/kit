import { ref } from 'vue';
import { useListBase } from './useListBase';
import { useListCursor } from './useListCursor';
import { useListNavigation } from './useListNavigation';
import { useListSelection } from './useListSelection';
import { useListFeedWorker } from './useListFeedWorker';
import { useListFeedChunkLoader } from './useListFeedChunkLoader';
import { useAgent } from './useAtproto';
import { ThreadModel } from '@gridsky/core/runtime/models/ThreadModel';
import {useThreadModel} from "@gridsky/core/runtime/composables/useThreadModel";

export function useListProfileFeed(
  actor: string,
  options?: { storePostsIntoPostsKeyVal?: boolean }
) {
  const workerConfig = {
    parser: {
      listKey: 'feed',
      actions: {}
    },
    storage: {
      context: 'gridsky:common',
      name: 'ProfileFeed',
      key: 'feed',
      actions: {
        storePostsIntoPostsKeyVal: options?.storePostsIntoPostsKeyVal ?? false,
      },
    },
  };

  const baseList = useListBase();
  const { cursor, resetCursor, updateCursor } = useListCursor();
  const { worker, postMessage, listenOnce } = useListFeedWorker(workerConfig);

  const _this: any = {
    ...baseList,
    cursor,
    worker,
    fetchList,
    refetchList,
    requestItems,
  };

  const chunkLoader = useListFeedChunkLoader(_this);
  _this.chunkLoader = chunkLoader;

  const selection = useListSelection(_this);
  _this.selection = selection

  const navigation = useListNavigation(_this)
  _this.navigation = navigation

  async function requestItems(reset?: boolean) {
    if (reset) {
      resetCursor();
    }

    workerConfig.parser.actions.resetCursor = !!reset

    const response = await useAgent('auto').app.bsky.feed.getAuthorFeed({
      actor,
      limit: 20,
      filter: 'posts_with_media',
      cursor: cursor.value,
    });

    if (response.data?.cursor) {
      updateCursor(response.data.cursor);
    }

    postMessage({
      type: 'process',
      config: workerConfig,
      response,
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
    baseList.prepareToAppendItems();

    const threadsInstanced: ThreadModel[] = [];
    let index = baseList.list.value.length;

    data.items.forEach((thread: any) => {
      const threadInstance = useThreadModel(thread, index);

      if (selection.selectedPostUrisToMarkAsSelected.value.includes(thread.post.uri)) {
        threadInstance.selection.select()
      }

      threadsInstanced.push(threadInstance);

      index++
    });

    data.items = threadsInstanced;

    await baseList.appendItems(data);
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
