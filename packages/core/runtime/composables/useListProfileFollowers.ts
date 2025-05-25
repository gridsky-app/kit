import { useListBase } from './useListBase';
import { useListCursor } from './useListCursor';
import { useListFeedWorker } from './useListFeedWorker';
import { useAgent } from './useAtproto';

export function useListProfileFollowers(actor: string) {
  const baseList = useListBase();

  const workerConfig = {
    parser: {
      listKey: 'followers',
    },
    storage: {
      context: 'gridsky:common',
      name: 'ProfileFollowers',
      key: actor,
    },
  };

  const { cursor, resetCursor, updateCursor } = useListCursor();
  const { worker, postMessage, listenOnce } = useListFeedWorker(workerConfig);

  const _this: any = {
    ...baseList,
    cursor,
    worker,
    fetchList,
    requestItems,
  };

  async function requestItems(reset?: boolean) {
    if (reset) resetCursor();

    const response = await useAgent('auto').app.bsky.graph.getFollowers({
      actor,
      cursor: cursor.value,
    });

    if (response.cursor) {
      updateCursor(response.cursor);
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

  async function fetchList(restart?: boolean) {
    baseList.isLoading.value = true;
    await requestItems(restart);
  }

  return _this;
}
