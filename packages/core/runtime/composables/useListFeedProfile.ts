import { useListFeed } from './useListFeed';

export function useListFeedProfile(source: { actor: string }, actions?: any) {
  const workerConfig = {
    parser: { listKey: 'feed' },
    storage: {
      context: 'gridsky:common',
      name: 'ProfileFeed',
      key: 'feed',
      actions: {
        storePostsIntoPostsKeyVal: actions?.storePostsIntoPostsKeyVal ?? false,
      },
    },
  };

  const feed = useListFeed(source, workerConfig);

  return {
    ...feed,
  };
}
