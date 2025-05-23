import {type DBSchema, openDB} from "idb";
import {WorkerModelListStorage} from "../models/WorkerModelListStorage";
import {dbVersion} from "../../consts/app";

interface MyDatabase extends DBSchema {
    Feed: {
        key: string
        value: any
    }
    FeedTimeline: {
        key: string
        value: any
    }
    ProfileFeed: {
        key: string
        value: any
    }
    SearchPosts: {
        key: string
        value: any
    }
}

export class WorkerModelListFeedStorage extends WorkerModelListStorage {
    public override async openStorage() {
        const config = this.config

        this.db = await openDB<MyDatabase>(config.storage.context, dbVersion)
    }

    public override async saveItemsToStorage(processedResult: WorkerFeedListProcessedResult) {
        await super.saveItemsToStorage(processedResult)
        await this.savePostsIndividually(processedResult.items)
    }

    private async savePostsIndividually(threads: any[]) {
        const tx = this.db.transaction('PostsKeyVal', 'readwrite');
        const store = tx.store

        threads.forEach(thread => {
            if (thread?.post?.uri) {
                store.put(thread, thread.post.uri);
            }
        });

        await tx.done;
    }
}
