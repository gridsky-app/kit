export class WorkerModelListFetch {
    public _cursor: string | undefined = undefined

    public config: ATProtoListWorkerConfig = {} as ATProtoListWorkerConfig

    constructor() {
    }

    public async parse(response): Promise<WorkerListProcessedResult> {
        const isFirstFetch = typeof this._cursor === 'undefined'

        this.setCursor(response.data.cursor)

       let processedItems = response.data[this.config.parser.listKey]

        // some raw data has something less than other
        // so we're normalizing it
        if (this.config.parser.normalizeItems) {

            // normalize by putting items in a sub property
            if (this.config.parser.normalizeItems && this.config.parser.normalizeItems.putInObjectProperty) {
                processedItems = processedItems.map((item: any) => {
                    return {
                        // @ts-ignore
                        [this.config.parser.normalizeItems.putInObjectProperty]: item
                    }
                })
            }

        }

        return {
            isFirstFetch,
            hasReachedEnd: !this._cursor,
            isFromCache: false,
            items: processedItems,
            cursor: this._cursor,
        }
    }

    public setConfig(config: ATProtoListWorkerConfig) {
        this.config = config
    }

    public setCursor(cursor: string) {
        this._cursor = cursor
    }

    private resetCursor() {
        this._cursor = undefined
    }
}
