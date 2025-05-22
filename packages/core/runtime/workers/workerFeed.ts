import {WorkerModelListFeedFetch} from "./models/WorkerModelListFeedFetch";
import {WorkerModelListFeedStorage} from "./models/WorkerModelListFeedStorage";

const fetcherRemote = new WorkerModelListFeedFetch()
const fetcherStorage = new WorkerModelListFeedStorage()

self.addEventListener('message', async (event) => {
    const {type} = event.data;

    switch (type) {
        case 'setWorkerConfig':
            const {config} = event.data;

            fetcherRemote.setConfig(config)
            fetcherStorage.setConfig(config)

            await fetcherStorage.openStorage()

            self.postMessage({
                type: 'workerConfigured'
            })

            break
        case 'fetch':
            const {meta} = event.data;

            if (meta && meta.overrideConfig) {
                fetcherRemote.setOverrideConfig(meta.overrideConfig)
                fetcherStorage.setOverrideConfig(meta.overrideConfig)
            }

            await fetchThreads(fetcherRemote.config)

            return
    }
})

self.addEventListener('close', () => {
    fetcherStorage.closeStorage()
})

async function fetchThreads(config) {
    /*
    if (config.fetcher.strategy === 'cacheFirstUpdateAfter') {
        const cacheData = await fetcherStorage.getFromStorage()

        if (!cacheData.emptyCache) {
            self.postMessage({ type: 'fetch', result: cacheData })
        }

        if (navigator.onLine) {
            try {
                const remoteData = await fetcherRemote.run()

                if (remoteData.items.length > 0) {
                    await fetcherStorage.saveItemsToStorage(remoteData)
                }

                self.postMessage({ type: 'fetch', result: remoteData })

            } catch (e) {
                console.error(e)
            }
        }

        return
    }
     */

    if (!navigator.onLine) {

        const cacheData = await fetcherStorage.getFromStorage()

        self.postMessage({ type: 'fetch', result: cacheData })

    } else {

        let remoteData

        try {
            remoteData = await fetcherRemote.run()
        } catch (e) {
            remoteData = {
                hasReachedEnd: true,
                wasFirstFetch: false,
                items: []
            }
        }

        if (remoteData.items.length > 0) {
            await fetcherStorage.saveItemsToStorage(remoteData)
        }

        self.postMessage({ type: 'fetch', result: remoteData })

    }
}
