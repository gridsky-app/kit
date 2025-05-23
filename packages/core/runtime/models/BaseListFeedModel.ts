import {BaseListModel} from "./BaseListModel";
import {ThreadModel} from "./ThreadModel";
import {useFeedChunkLoader} from "../composables/useFeedChunkLoader"
import {useWorkerFeed} from "../composables/useWorkerFeed"
import {useAgent} from "../composables/useAgent";

export class BaseListFeedModel extends BaseListModel {
    private readonly indexOffsetLoadMoreBeforeEndReached = 15

    public worker = useWorkerFeed()
    public workerConfig = {
      parser: {
        listKey: 'feed',
      },
      storage: {
        context: 'gridsky:common',
        name: 'Feed',
        key: this.source['feed']
      },
    }

    public cursor: string | number | undefined = undefined

    public chunkLoader = useFeedChunkLoader(this)

    constructor(source?: any | { feed: string }, options?: any) {
        super(source)

        return this
    }

    override async requestItems(resetCursor?: boolean) {
        if (resetCursor) {
            this.cursor = undefined
        }

        return new Promise(async (resolve, reject) => {
            const response = await useAgent('auto').app.bsky.feed.getFeed({
              limit: 25,
              ...this.source,
              cursor: this.cursor,
            })

            if (response.data && response.data.cursor) {
              this.cursor = response.data.cursor
            }

            this.worker.postMessage({
              type: 'process',
              config: this.workerConfig,
              response
            })

            this.worker.addEventListener('message', async (e) => {
              if (e.data.type === 'processed') {

                await this.appendItems(e.data.result)

                this.chunkLoader.preloadNextChunk('BaseListFeedModel')

                resolve(true)

              }
            }, { once: true })
        })
    }

    override async appendItems(data: { hasReachedEnd: boolean, items: any[] }) {
        super.prepareToAppendItems()

        // convert each item in ThreadModel and populate list
        const threadsInstanced: ThreadModel[] = []

        let index = this.list.length

        data.items.forEach((thread: any) => {
            const threadInstance = new ThreadModel(thread, index)

            if (this.selectedPostUrisToMarkAsSelected.includes(thread.post.uri)) {
                threadInstance.selection.select()
            }

            threadsInstanced.push(threadInstance)

            index++
        })

        // overwrite items with instanced items
        data.items = threadsInstanced

        // call parent method to append lists
        await super.appendItems(data)
    }

    // NAVIGATION

    public activeIndex: number = -1

    get hasNavigatorReachedEnd() {
        return this.activeIndex === this.list.length - 1
    }

    public findListIndex(thread: any) {
        return this.list.findIndex((t: any) => t.post.cid === thread.post.cid)
    }

    public setActiveIndex(index: number) {
        this.activeIndex = index
    }

    public resetActiveIndex() {
        this.activeIndex = -1
    }

    public get activeItem() {
        if (this.activeIndex < 0) {
            return undefined
        }

        return this.list[this.activeIndex]
    }

    public prevItem() {
        if (this.activeIndex > 0) {
            this.activeIndex--

            return true
        }

        return false
    }

    public async nextItem() {
        if (this.hasNavigatorReachedEnd) {
            return false
        }

        // if already loading more items and we are at the loaded items end
        if (this.activeIndex === this.list.length - 1) {
            if (!this.isLoading) {
                await this.fetchList()
            }

            // it tried to more but it reached the real end
            if (this.activeIndex === this.list.length - 1) {
                return false
            }
        }

        // better to load more items now
        // (if it isn't already loading)
        if (this.activeIndex === this.list.length - this.indexOffsetLoadMoreBeforeEndReached) {
            if (!this.isLoading) {
                this.fetchList()
            }
        }

        this.activeIndex++

        return true
    }

    private selectedPostUrisToMarkAsSelected: string[] = []

    // PROFILE EDITOR / POST SELECTION

    get listSelectedItems() {
        return this.list.filter((thread: ThreadModel) => thread.selection.selected.value)
    }

    public setPreSelectedPostsList(selectedPostUrisToMarkAsSelected: string[]) {
        this.selectedPostUrisToMarkAsSelected = selectedPostUrisToMarkAsSelected
    }

    public applyPreSelectionOnProcessedList() {
        // map
        this.list.forEach((thread: ThreadModel) => {
            thread.selection.set(
                this.selectedPostUrisToMarkAsSelected.includes(thread.post.uri)
            )
        })

    }

    public applyFilterLogicByNotSelected() {
        this.setFilterLogic((thread: ThreadModel) => !thread.selection.selected.value)
    }

    // NAVIGATION FROM GRID TO VERTICAL
}
