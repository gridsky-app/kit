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
        const store = this.db.transaction(this.config.storage.name, 'readonly').store
        const data: ATProtoListWorkerFeedStoredData = await store.get(this.config.storage.key)

        this.pageSize = this.config.fetcher.options.limit ?? 15

        if (!data || !Array.isArray(data.items)) {
            return {
                items: [],
                wasFirstFetch: this.currentPage === 1,
                hasReachedEnd: true,
                fromCache: true,
                emptyCache: true,
            }
        }

        const start = this.currentPage * this.pageSize
        const end = start + this.pageSize

        const itemsPortion = data.items.slice(start, end)
        this.currentPage++

        return {
            items: itemsPortion,
            wasFirstFetch: this.currentPage === 1,
            hasReachedEnd: data.items.length <= end,
            cursor: data.cursor,
            fromCache: true,
        }
    }

    public async saveItemsToStorage(processedResult: ATProtoListWorkerResult) {

        const tx = this.db.transaction(this.config.storage.name, 'readwrite')
        const store = tx.store

        if (processedResult.wasFirstFetch) {
            await store.put({
                items: processedResult.items,
                updateAd: new Date().toISOString(),
            }, this.config.storage.key)
        } else {
            const existingDataRecord: ATProtoListWorkerFeedStoredData = await store.get(this.config.storage.key) ?? []
            await store.put({
                cursor: processedResult.cursor,
                items: [
                    ...existingDataRecord.items,
                    ...processedResult.items,
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
