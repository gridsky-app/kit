import {deepMerge} from "../../utils/utilObject";

export class WorkerModelListStorage {
    public config: ATProtoListWorkerConfig = {} as ATProtoListWorkerConfig
    public db?: IDBDatabase<MyDatabase>

    public currentPage: number = 0
    public pageSize: number = 15

    constructor() {
        if (!this.config) throw new Error("Storage config is not set")
    }

    public async openStorage() {}

    public closeStorage() {
        this.db.close()
    }

    public async getFromStorage(): Promise<any> {
        // todo rebuild items from uris
        const store = this.db.transaction(this.config.storage.name, 'readonly').store
        const data: ATProtoListWorkerFeedStoredData = await store.get(this.config.storage.key)

        this.pageSize = this.config.fetcher.options.limit ?? 15

        if (!data || !Array.isArray(data.items)) {
            return {
                isFirstFetch: this.currentPage === 1,
                isFromCache: true,
                hasReachedEnd: true,
                uris: [],
                cursor: '',
            }
        }

        const start = this.currentPage * this.pageSize
        const end = start + this.pageSize

        const urisPortion = data.uris.slice(start, end)
        this.currentPage++

        return {
            isFirstFetch: this.currentPage === 1,
            isFromCache: true,
            hasReachedEnd: data.items.length <= end,
            uris: urisPortion,
            cursor: data.cursor,
        }
    }

    public async saveItemsToStorage(processedResult: ATProtoListWorkerResult) {
        const tx = this.db.transaction(this.config.storage.name, 'readwrite')
        const store = tx.store

        const existingDataRecord: ATProtoListWorkerFeedStoredData = await store.get(this.config.storage.key)

        if (processedResult.isFirstFetch || !existingDataRecord) {
            await store.put({
                uris: processedResult.items.map((rawThread: any) => rawThread.post.uri),
                updateAd: new Date().toISOString(),
            }, this.config.storage.key)
        } else {
          await store.put({
                cursor: processedResult.cursor,
                uris: [
                    ...existingDataRecord.uris,
                    ...processedResult.items.map((rawThread: any) => rawThread.post.uri),
                ],
                updateAd: new Date().toISOString(),
            }, this.config.storage.key)
        }

        await tx.done
    }

    public setConfig(config: ATProtoListWorkerConfig) {
        this.config = config
    }

    public setOverrideConfig(partialConfig: Partial<ATProtoListWorkerConfig>) {
        this.config = deepMerge(this.config, partialConfig)
    }
}
