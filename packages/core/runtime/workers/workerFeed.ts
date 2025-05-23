import {WorkerModelListFeedParser} from "./models/WorkerModelListFeedParser";
import {WorkerModelListFeedStorage} from "./models/WorkerModelListFeedStorage";

const workerModelFeedParser = new WorkerModelListFeedParser()
const workerModelFeedStorage = new WorkerModelListFeedStorage()

self.addEventListener('message', async (event) => {
    const {type} = event.data;

    switch (type) {
        case 'process':
            const {config, response} = event.data;

            workerModelFeedParser.setConfig(config)
            workerModelFeedStorage.setConfig(config)

            await workerModelFeedStorage.openStorage()

            if (!navigator.onLine) {

              const cacheData = await workerModelFeedStorage.getFromStorage()

              self.postMessage({ type: 'processed', result: cacheData })

            } else {

              let processedResult: WorkerFeedListProcessedResult

              try {
                processedResult = await workerModelFeedParser.parse(response)
              } catch (e) {
                processedResult = {
                  isFirstFetch: false,
                  isFromCache: false,
                  hasReachedEnd: true,
                  items: [],
                  cursor: undefined,
                }
              }

              if (processedResult.items.length > 0) {
                await workerModelFeedStorage.saveItemsToStorage(processedResult)
              }

              self.postMessage({
                type: 'processed',
                result: processedResult
              })

            }

            return
    }
})

self.addEventListener('close', () => {
    workerModelFeedStorage.closeStorage()
})
