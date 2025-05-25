import {FeedModel} from "./FeedModel";
import {useAgent} from "../composables/useAtproto";

export class ProfileFeedModel extends FeedModel {
    private readonly actions: {
        storePostsIntoPostsKeyVal?: boolean
    } = {}

    constructor(
        source: { actor: string },
        actions?: {
            storePostsIntoPostsKeyVal?: boolean
        }
    ) {
        super(source)

        this.actions = actions ?? {}
    }

    private override async setupWorker() {
      this.worker = new Worker(
        new URL('@gridsky/core/runtime/workers/workerFeedModel.ts', import.meta.url),
        {type: 'module'}
      )

        this.worker.postMessage({
            type: 'setWorkerConfig',
            config: {
                /*
                fetcher: {
                    method: 'app.bsky.feed.getAuthorFeed',
                    options: {
                        limit: 20,
                        filter: 'posts_with_media',
                        ...this.source,
                    },
                },
                 */
                processor: {
                    listKey: 'feed',
                },
                storage: {
                    context: 'gridsky:common',
                    name: 'ProfileFeed',
                    key: 'feed',
                    actions: {
                        storePostsIntoPostsKeyVal: this.actions && this.actions.storePostsIntoPostsKeyVal
                    }
                },
            }
        })
    }

    override async requestItems(resetCursor?: boolean) {
        if (resetCursor) {
            this.cursor = undefined
        }

        return new Promise(async (resolve, reject) => {

          const response = await useAgent('auto').app.bsky.feed.getAuthorFeed({
            limit: 20,
            filter: 'posts_with_media',
            ...this.source,
            cursor: this.cursor,
          })

          if (response.data && response.data.cursor) {
            this.cursor = response.data.cursor
          }

          this.worker.postMessage({
            type: 'fetch',
            meta: {
              overrideConfig: {
                fetcher: {
                  response
                },
              }
            }
          })

          this.worker.addEventListener('message', (event) => {
            if (event.data.type === 'fetch') {
              this.appendItems(event.data.result)

              resolve(true)
            }
          }, { once: true })

        })
    }
}
