import {openDB} from "idb";
import {dbVersion} from "../../consts/app";

export class WorkerModelProfileStorage {
    public db?: IDBDatabase<Profile>

    constructor() {
    }

    public async openStorage() {
        if (this.db) return

        this.db = await openDB<Profile>('gridsky:common', dbVersion)
    }

    public closeStorage() {
        if (this.db) {
            this.db.close()
        }
    }

    public async saveProfileToStorage(did: string, result: any) {
        if (!this.db) {
            throw new Error('Database is not initialized')
        }

        const txFeedGeneratorPopular = this.db.transaction('Profile', 'readwrite')
        const storeFeedGeneratorPopular = txFeedGeneratorPopular.store

        await storeFeedGeneratorPopular.put(result, did)
    }

    public async getProfileFromStorage(did: string) {
        if (!this.db) {
            throw new Error('Database is not initialized')
        }

        const store = this.db.transaction('Profile', 'readonly').store

        return store.get(did)
    }
}
