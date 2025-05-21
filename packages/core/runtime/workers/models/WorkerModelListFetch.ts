import {deepMerge} from "../../utils/utilObject";
import {useWorkerAgentWithService} from "../utils/utilWorkerAgent";

export class WorkerModelListFetch {
    public _cursor: string | undefined = undefined

    public config: ATProtoListWorkerConfig = {} as ATProtoListWorkerConfig

    constructor() {
    }

    get params() {
        const data: any = {
            ...this.config.fetcher.options,
        }

        if (this._cursor) {
            data.cursor = this._cursor
        }

        return data
    }

    public async run() {
        // reset cursor if needed by "actions" config
        if (this.config.fetcher.actions?.resetCursor === true) {
            this._cursor = undefined
        }

        const rawResult = await this.fetcher()

        if (!rawResult) {
            return {
                wasFirstFetch: false,
                hasReachedEnd: true,
                fromCache: false,
                items: [],
                cursor: undefined
            }
        }

        return this.processor(rawResult)
    }

    private async fetcher(): Promise<ATProtoListWorkerRawResult | null> {
        if (this.config.fetcher.response) {
            this._cursor = this.config.fetcher.response.data.cursor

            const response = this.config.fetcher.response

            return {
                wasFirstFetch: typeof this._cursor === 'undefined',
                hasReachedEnd: !this.config.fetcher.response.data.cursor,
                fromCache: false,

                // data is generic because contains results in a specific property
                data: response.data
            }
        }

        // determine which bsky function to call
        function getMethod(obj: any, path: string): any {
            return path.split(".").reduce((acc, key) => acc?.[key] ?? Object.getPrototypeOf(acc)?.[key], obj)
        }

        const method = getMethod(useWorkerAgentWithService(), this.config.fetcher.method)
        const context = getMethod(useWorkerAgentWithService(), this.config.fetcher.method.split(".").slice(0, -1).join("."))

        if (typeof method !== "function") {
            throw new Error(`Method "${this.config.fetcher.method}" not found or is not a function`)
        }

        // make the call
        const response = await method.call(context, this.params)

        // handle the bsky fetch result
        if (response) {

            const rawResult = {
                wasFirstFetch: typeof this._cursor === 'undefined',
                hasReachedEnd: !response.data.cursor,
                fromCache: false,

                // data is generic because contains results in a specific property
                data: response.data
            }

            this.setCursor(response.data.cursor)

            return rawResult

        } else {
            return null
        }
    }

    public async processor(rawResult: ATProtoListWorkerRawResult): Promise<ATProtoListWorkerResult> {
        let processedItems = rawResult.data[this.config.processor.listKey]

        // some raw data has something less than other
        // so we're normalizing it
        if (this.config.processor.normalizeItems) {

            // normalize by putting items in a sub property
            if (this.config.processor.normalizeItems && this.config.processor.normalizeItems.putInObjectProperty) {
                processedItems = processedItems.map((item: any) => {
                    return {
                        // @ts-ignore
                        [this.config.processor.normalizeItems.putInObjectProperty]: item
                    }
                })
            }

        }

        return {
            wasFirstFetch: rawResult.wasFirstFetch,
            hasReachedEnd: rawResult.hasReachedEnd || !rawResult.data.cursor,
            fromCache: false,
            items: processedItems,
            cursor: rawResult.data.cursor,
        }
    }

    public setConfig(config: ATProtoListWorkerConfig) {
        this.config = config
    }

    public setOverrideConfig(partialConfig: Partial<ATProtoListWorkerConfig>) {
        // uris options should always be resetted
        // CUSTOM BEHAVIOR FOR PROFILE_POSTS
        if (partialConfig.fetcher && partialConfig.fetcher.options && partialConfig.fetcher?.options.uris) {
            this.config.fetcher.options.uris = []
        }
        // result too
        if (partialConfig.fetcher && partialConfig.fetcher?.result) {
            this.config.fetcher.result = {}
        }

        this.config = deepMerge(this.config, partialConfig) as ATProtoListWorkerConfig
    }

    public setCursor(cursor: string) {
        this._cursor = cursor
    }

    private resetCursor() {
        this._cursor = undefined
    }
}
