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

    public override async saveItemsToStorage(processedResult: ATProtoListWorkerResult) {
        await super.saveItemsToStorage(processedResult)

        if (this.config.storage && this.config.storage.actions && this.config.storage.actions.storePostsIntoPostsKeyVal) {
            await this.savePostsIndividually(processedResult.items)
        }
    }

    private async savePostsIndividually(posts: any[]) {
        const tx = this.db.transaction('PostsKeyVal', 'readwrite');
        const store = tx.store

        posts.forEach(thread => {
            if (thread?.post?.uri) {
                store.put(thread, thread.post.uri);
            }
        });

        await tx.done;
    }
}
