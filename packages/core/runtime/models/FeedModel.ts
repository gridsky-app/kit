import {BaseListFeedModel} from "./BaseListFeedModel";

export class FeedModel extends BaseListFeedModel {
    constructor(source?: any | { feed: string }, options?: any) {
        super(source)

        this.fetchList()
    }
}
