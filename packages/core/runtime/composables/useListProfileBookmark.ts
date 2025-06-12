import {useListBase} from './useListBase';
import {useListCursor} from './useListCursor';
import {useListNavigation} from './useListNavigation';
import {useListFeedWorker} from './useListFeedWorker';
import {useListFeedChunkLoader} from './useListFeedChunkLoader';
import {useAccountSessionStore} from '@gridsky/core/runtime/stores/storeAccountSession'
import {useAccountBookmarksStore} from "@gridsky/core/runtime/stores/storeAccountBookmarks";
import {useThreadModel} from "@gridsky/core/runtime/composables/useThreadModel";
import {useAgent} from './useAtproto';
import {BookmarkRecord} from "@/lex";

export function useListProfileBookmark(source) {
  const accountSessionStore = useAccountSessionStore()
  const accountBookmarkStore = useAccountBookmarksStore()

  const workerConfig = {
    parser: {
      listKey: 'posts',
      actions: {
        resetCursor: false
      },
      normalizeItems: {
        putInObjectProperty: 'post',
      },
    },
    storage: {
      context: 'gridsky:common',
      name: 'ProfileBookmarks',
      key: accountSessionStore.activeDid,
    },
  }

  const baseList = useListBase(source);
  const {cursor, resetCursor, updateCursor} = useListCursor();
  const {worker, postMessage, listenOnce} = useListFeedWorker(workerConfig);

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

  const navigation = useListNavigation(_this)
  _this.navigation = navigation

  async function requestItems(reset?: boolean) {
    if (reset) {
      resetCursor();
    }

    workerConfig.parser.actions.resetCursor = !!reset

    const agent = new BookmarkRecord(useAgent("private"));

    const response = await agent.list({
      repo: accountSessionStore.activeDid,
      cursor: cursor.value,
      limit: 50,
    });

    // store original bookmark records
    accountBookmarkStore.bookmarks.push(
      ...response.records
    )

    const bookmarkRecords = response.records.filter(record => !!record.value?.subject);
    const postUris = bookmarkRecords.map(record => record.value.subject);

    if (response.cursor) {
      updateCursor(response.cursor);
    }

    if (postUris.length === 0) {
      return;
    }

    const postsResponse = await useAgent('auto').app.bsky.feed.getPosts({
      uris: postUris,
    });

    postMessage({
      type: 'process',
      config: workerConfig,
      response: postsResponse,
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

    // convert each item in ThreadModel and populate list
    const threadsInstanced: ThreadModel[] = []

    let index = baseList.list.value.length

    data.items.forEach((thread: any) => {
      const threadInstance = useThreadModel(thread, index);
      threadsInstanced.push(threadInstance);
      threadInstance.setBookmark(true)
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


  return _this
}
