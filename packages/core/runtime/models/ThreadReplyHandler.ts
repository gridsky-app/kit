import { useAccountStore } from "@gridsky/core/runtime/stores/storeAccount"
import {useAgent} from "@gridsky/core/runtime/composables/useAtproto";
import {RichText} from "@atproto/api"
import {useThreadModel} from "@gridsky/core/runtime/composables/useThreadModel";

export class ThreadReplyHandler {
    private text: string = ''
    private thread: ThreadModel

    constructor(thread: ThreadModel) {
        this.thread = thread
    }

    async send(data: {
        root: { uri: string, cid: string },
        parent: { uri: string, cid: string }
    }) {
        const accountStore = useAccountStore()
        const atprotoAgent = useAgent("private")

        const rt = new RichText({text: this.text})
        await rt.detectFacets(atprotoAgent)

        const createdThreadReply = await atprotoAgent
          .post({
            text: rt.text,
            facets: rt.facets,
            reply: {
              parent: data.parent,
              root: data.root,
            },
            createdAt: new Date().toISOString(),
          })

        const createdAt = new Date().toISOString()

        const virtualThreadReply = useThreadModel({
            $type: "app.bsky.feed.defs#threadViewPost",
            post: {
                uri: createdThreadReply.uri,
                cid: createdThreadReply.cid,
                author: {
                    did: accountStore.account.did,
                    handle: accountStore.account.handle,
                    displayName: accountStore.account.displayName,
                    avatar: accountStore.account.avatar,
                    viewer: {muted: false, blockedBy: false},
                    labels: [],
                    createdAt,
                },
                record: {
                    $type: "app.bsky.feed.post",
                    createdAt,
                    reply: {
                        parent: data.parent,
                        root: data.root,
                    },
                    text: this.text,
                },
                replyCount: 0,
                repostCount: 0,
                likeCount: 0,
                quoteCount: 0,
                indexedAt: new Date().toISOString(),
                viewer: {
                    threadMuted: false,
                    embeddingDisabled: false,
                },
                labels: [],
            },
            replies: [],
            threadContext: {},
        })

        if (data.root.uri === data.parent.uri) {
            this.thread.replies.unshift(virtualThreadReply)
        } else {
            const reply = this.thread.replies.find(thread => thread.post.uri === data.parent.uri)

            reply.post.replyCount++
            reply.replies.unshift(virtualThreadReply)
        }

        this.clear()

        useState(STATE_THREAD_REPLY_PARENT).value = undefined
    }

    clear() {
        this.text = ''
    }
}
