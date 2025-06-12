import { useAccountSessionStore } from "@gridsky/core/runtime/stores/storeAccountSession"
import {useAgent} from "@gridsky/core/runtime/composables/useAtproto";
import {useListProfileBookmark} from "@gridsky/core/runtime/composables/useListProfileBookmark";
import {BookmarkRecord} from "@/lex";
import {defineStore} from "pinia"
import {ref} from "vue"

export const useAccountBookmarksStore = defineStore(`account/bookmarks`, () => {
    const model = ref()

    const bookmarks = ref<{
        uri: string,
        cid: string,
        value: {
            subject: string
        }
    }[]>([])

    async function setupModel() {
        model.value = useListProfileBookmark('bookmarks')
    }

    async function createThreadBookmark(thread: ThreadModel, tags: string[] = []) {
        const accountSessionStore = useAccountSessionStore()
        const agentBookmark = new BookmarkRecord(useAgent("private"));

        thread.setBookmark(true)

        await agentBookmark.create({
                repo: accountSessionStore.activeDid,
                rkey: 'self',
            },
            {
                $type: 'community.lexicon.bookmarks.bookmark',
                subject: thread.post.uri,
                createdAt: new Date().toISOString(),
            },
        )
    }

    async function deleteThreadBookmark(thread: ThreadModel) {
        const accountSessionStore = useAccountSessionStore()
        const agentBookmark = new BookmarkRecord(useAgent("private"));

        thread.setBookmark(false)

        const bookmarkToDelete = bookmarks.value.find(b => {
            return b.value.subject === thread.post.uri
        })

        if (bookmarkToDelete) {
            return agentBookmark.delete({
                repo: accountSessionStore.activeDid,
                rkey: bookmarkToDelete.uri.split('/').pop(),
            })
        }
    }

    return {
        model,
        bookmarks,

        setupModel,
        createThreadBookmark,
        deleteThreadBookmark,
    }
})
