import { ref, computed } from 'vue';
import { useListBase } from './useListBase';
import { useListCursor } from './useListCursor';
import { useListFeedWorker } from './useListFeedWorker';
import { useListFeedChunkLoader } from './useListFeedChunkLoader';
import { useAgent } from './useAtproto';
import {ThreadModel} from "@gridsky/core/runtime/models/ThreadModel";

export function useListFeedSearch() {
  const workerConfig = {
    parser: {
      listKey: 'posts',
      normalizeItems: {
        putInObjectProperty: 'post',
      },
    },
    storage: {
      context: 'gridsky:common',
      name: 'PostsSearch',
      key: '',
    },
  };

  const query = ref('');
  const sort = ref('top');
  const tag = ref<string[]>([]);
  const author = ref('');
  const isNewSearch = ref(true);

  const baseList = useListBase({});
  const { cursor, resetCursor, updateCursor } = useListCursor();
  const { worker, postMessage, listenOnce } = useListFeedWorker(workerConfig);

  const _this: any = {
    ...baseList,
    fetchList,
    refetchList,
    requestItems,
    cursor,
    worker,
  }

  const chunkLoader = useListFeedChunkLoader(_this);

  _this.chunkLoader = chunkLoader

  async function requestItems(resetCursor?: boolean) {
    if (resetCursor) {
      cursor.value = undefined;
      isNewSearch.value = true;
    }

    const response = await useAgent('auto').app.bsky.feed.searchPosts({
      q: query.value,
      sort: sort.value,
      cursor: cursor.value,
    });

    if (response.data && response.data.cursor) {
      cursor.value = response.data.cursor;
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

  async function appendItems(data: { hasReachedEnd: boolean, items: any[] }) {
    baseList.prepareToAppendItems()

    const threadsInstanced: ThreadModel[] = []

    let index = baseList.list.value.length

    data.items.forEach((thread: any) => {
      const threadInstance = new ThreadModel(thread, index)

      threadsInstanced.push(threadInstance)

      index++
    })

    data.items = threadsInstanced

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

  function setQuery(newQuery: string) {
    query.value = newQuery;
    isNewSearch.value = true;
  }

  function setSort(newSort: string) {
    sort.value = newSort;
    isNewSearch.value = true;
  }

  function setTag(newTag: string[]) {
    tag.value = newTag;
    isNewSearch.value = true;
  }

  function setAuthor(newAuthor: string) {
    author.value = newAuthor;
    isNewSearch.value = true;
  }

  return {
    ..._this,
    query,
    sort,
    tag,
    author,
    fetchList,
    requestItems,
    setQuery,
    setSort,
    setTag,
    setAuthor,
    isNewSearch: computed(() => isNewSearch.value),
  };
}
