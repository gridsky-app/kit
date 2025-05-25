import { ref } from 'vue';
import { useListBase } from './useListBase';
import { useListCursor } from './useListCursor';
import { useListSelection } from './useListSelection';
import { useListFeedWorker } from './useListFeedWorker';
import { useListFeedChunkLoader } from './useListFeedChunkLoader';
import { useAgent } from './useAtproto';
import { ThreadModel } from '@gridsky/core/runtime/models/ThreadModel';

export function useListProfileFeed(
  actor: string,
  options?: { storePostsIntoPostsKeyVal?: boolean }
) {
  const workerConfig = {
    parser: {
      listKey: 'feed',
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
    requestItems,
  };

  const chunkLoader = useListFeedChunkLoader(_this);
  const selection = useListSelection(_this);

  _this.chunkLoader = chunkLoader;
  _this.selection = selection

  async function requestItems(reset?: boolean) {
    if (reset) {
      resetCursor();
    }

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
      const threadInstance = new ThreadModel(thread, index);

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
    window.alert('QWE')
    baseList.isLoading.value = true;
    await requestItems(restart);
    baseList.isLoading.value = false;
  }

  return _this;
}
