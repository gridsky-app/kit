import {WorkerModelListFetch} from "./WorkerModelListFetch";

import {
    workerFetchThreadLikes,
    workerIsValidThread
} from "../utils/utilWorkerThread";

export class WorkerModelListFeedFetch extends WorkerModelListFetch {
    private uniqueUris: string[] = []

    public override async run() {
        // reset cursor if needed by "actions" config
        if (this.config.fetcher.actions && this.config.fetcher.actions?.resetCursor === true) {
            this.uniqueUris = []
        }

        return await super.run()
    }

    private override async processor(rawResult: ATProtoListWorkerResult) {
        const processedResult = await super.processor(rawResult)

        // exclude invalid threads like those with missing images or videos
        processedResult.items = processedResult.items.filter(item => {
            if (!workerIsValidThread(item)) {
                return false
            }

            if (!this.config.processor.ignoreUniqueUris && this.uniqueUris.indexOf(item.post.uri) > -1) {
                return false
            }

            this.uniqueUris.push(item.post.uri)

            return true
        })

        // prepare fetch-like promises
        const likePromisesToPreload = processedResult.items.map((rawThread: any) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const likesData = rawThread.post.uri.startsWith('draft://')
                        ? await workerFetchThreadLikes(rawThread)
                        : null

                    resolve({ threadUri: rawThread.post.uri, likes: likesData });
                } catch (error) {
                    resolve({ threadUri: rawThread.post.uri, likes: null })
                }
            });
        })

        // prepare fetch-media promises
        /*
        const mediaPromisesToPreload = processedResult.items.flatMap(
            (threadItem: any) => workerGetThreadMediaUrlsToPreload(threadItem)
        )
         */

        // create array of promises
        const allPromises = [
            Promise.all(likePromisesToPreload),
            //mediaPromisesToPreload.length > 0 ? workerPreloadImages(mediaPromisesToPreload) : Promise.resolve() // preloadImages or resolve if empty
        ]

        // run both at the same time
        const [likesResult] = await Promise.all(allPromises)
        // imagesResult

        // set likes on each thead
        const likesMap = likesResult.reduce((acc, result) => {
            if (result) {
                acc[result.threadUri] = result.likes
            }
            return acc
        }, {})

        processedResult.items.forEach(rawThread => {
            rawThread.likes = likesMap[rawThread.post.uri] || null
        })

        return processedResult
    }
}
