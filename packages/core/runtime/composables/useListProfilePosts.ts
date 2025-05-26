import { toRaw } from 'vue';
import { useListBase } from './useListBase';
import { useListNavigation } from './useListNavigation';
import { useListFeedWorker } from './useListFeedWorker';
import { useAgent } from './useAtproto';
import {useListFeedChunkLoader} from "@gridsky/core/runtime/composables/useListFeedChunkLoader";
import {useListSelection} from "@gridsky/core/runtime/composables/useListSelection";

export function useListProfilePosts(uris: string[], feedGridKey: string) {
  const baseList = useListBase();
  const pageSize = 15;
  let currentPage = 0;

  const workerConfig = {
    parser: {
      listKey: 'posts',
      ignoreUniqueUris: true,
      normalizeItems: {
        putInObjectProperty: 'post',
      },
    },
    storage: {
      context: 'gridsky:common',
      name: 'ProfilePosts',
      key: `grid:${feedGridKey}`,
      actions: {
        storePostsIntoPostsKeyVal: true,
      },
    },
  };

  const { worker, postMessage, listenOnce } = useListFeedWorker(workerConfig);

  const _this: any = {
    ...baseList,
    worker,
    fetchList,
    refetchList,
    requestItems,
    updateUris,
  };

  const chunkLoader = useListFeedChunkLoader(_this);
  _this.chunkLoader = chunkLoader

  const selection = useListSelection(_this);
  _this.selection = selection

  const navigation = useListNavigation(_this)
  _this.navigation = navigation

  function getNextPageUris() {
    const startIndex = currentPage * pageSize;
    const endIndex = Math.min(startIndex + pageSize, uris.length);
    return uris.slice(startIndex, endIndex);
  }

  async function requestItems(restart = false) {
    if (restart) currentPage = 0;

    const nextPageUris = getNextPageUris();

    if (nextPageUris.length === 0) {
      return;
    }

    const response = await useAgent('auto').app.bsky.feed.getPosts({
      uris: nextPageUris,
    });

    postMessage('process', {
      config: toRaw(workerConfig),
      response,
    });

    return new Promise((resolve) => {
      listenOnce('processed', async (e) => {
        currentPage++;

        e.data.result.hasReachedEnd = getNextPageUris().length === 0;

        await baseList.appendItems(e.data.result);

        chunkLoader.preloadNextChunk('BaseListFeedModel')

        resolve(true);
      });
    });
  }

  async function fetchList(restart = false) {
    baseList.isLoading.value = true;
    await requestItems(restart);
    baseList.isLoading.value = false;
  }

  async function refetchList() {
    await fetchList(true);
  }

  function updateUris(newUris: string[]) {
    uris = newUris;
    currentPage = 0;
    baseList.clearList();
  }

  return _this;
}
