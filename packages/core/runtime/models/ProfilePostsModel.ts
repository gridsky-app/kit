import {FeedModel} from "./FeedModel";
import {useAgent} from "../composables/useAgent";

export class ProfilePostsModel extends FeedModel {
    private readonly feedGridKey: string = ''

    private pageSize: number = 15
    private currentPage: number = -1

    constructor(source: { uris: string[] }, feedGridKey: string) {
        super(source)

        this.feedGridKey = feedGridKey
    }

    private override async setupWorker() {
      this.worker = new Worker(
        new URL('@gridsky/core/runtime/workers/workerFeedModel.ts', import.meta.url),
        {type: 'module'}
      )

      const initialUris = this.getNextPageUris();

        this.worker.postMessage({
            type: 'setWorkerConfig',
            config: {
                fetcher: {
                    method: 'app.bsky.feed.getPosts',
                    options: {
                        uris: initialUris
                    },
                },
                processor: {
                    listKey: 'posts',
                    ignoreUniqueUris: true,
                    normalizeItems: {
                        putInObjectProperty: 'post'
                    }
                },
                storage: {
                    context: 'gridsky:common',
                    name: 'ProfilePosts',
                    key: `grid:${this.feedGridKey}`,
                    actions: {
                        storePostsIntoPostsKeyVal: true
                    }
                },
            }
        })

        this.worker.onmessage = (event) => {
            if (event.data.type === 'fetch') {

                // this fetch is really dummy,
                // worker can't know if we at the end
                // so we'll have to determine it manually
                const nextPageUris = this.getNextPageUris()

                // override hasReachedEnd
                event.data.result.hasReachedEnd = nextPageUris.length === 0

                this.appendItems(event.data.result)
            }
        }
    }

    override async requestItems(restart?: boolean) {
        if (restart) {
            this.currentPage = -1
        }

        this.currentPage++;

        const nextPageUris = this.getNextPageUris();

        if (nextPageUris.length > 0) {

            this.worker.postMessage({
                type: 'fetch',
                meta: {
                    overrideConfig: {
                        fetcher: {
                            options: {
                                uris: nextPageUris
                            },
                        }
                    }
                }
            })
        }
    }

    public updateUris(uris: string[]) {
        this.source.uris = uris
    }

    private getNextPageUris(): string[] {
        const startIndex = this.currentPage * this.pageSize;
        const endIndex = Math.min(startIndex + this.pageSize, this.source.uris.length);
        return this.source.uris.slice(startIndex, endIndex);
    }
}
