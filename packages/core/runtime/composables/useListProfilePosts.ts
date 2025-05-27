import { toRaw } from 'vue';
import { useListBase } from './useListBase';
import { useListNavigation } from './useListNavigation';
import { useListFeedWorker } from './useListFeedWorker';
import { useAgent } from './useAtproto';
import {useListFeedChunkLoader} from "@gridsky/core/runtime/composables/useListFeedChunkLoader";
import {useListSelection} from "@gridsky/core/runtime/composables/useListSelection";
import {ThreadModel} from "../models/ThreadModel";

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

    postMessage({
      type: 'process',
      config: workerConfig,
      response,
    });

    return new Promise((resolve) => {
      listenOnce('processed', async (e) => {
        currentPage++;

        e.data.result.hasReachedEnd = getNextPageUris().length === 0;

        await appendItems(e.data.result);

        chunkLoader.preloadNextChunk('BaseListFeedModel')

        resolve(true);
      });
    });
  }

  async function appendItems(data: { hasReachedEnd: boolean, items: any[] }) {
    baseList.prepareToAppendItems()

    // convert each item in ThreadModel and populate list
    const threadsInstanced: ThreadModel[] = []

    let index = baseList.list.value.length

    data.items.forEach((thread: any) => {
      threadsInstanced.push(
        new ThreadModel(thread, index)
      )
      index++
    })

    // overwrite items with instanced items
    data.items = threadsInstanced

    // call parent method to append lists
    await baseList.appendItems(data)
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
