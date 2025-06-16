import { useAccountStore } from "@gridsky/core/runtime/stores/storeAccount"
import { useProfileGridStore } from "@gridsky/core/runtime/stores/storeProfileGrid"
import {useAgent} from "@gridsky/core/runtime/composables/useAtproto";

export const useThreadDraftListStore = defineStore('thread/draft/list', () => {
    const accountStore = useAccountStore()

    const threadDraft = ref<any>()
    const threadDraftList = ref<any[]>([])
    const threadDraftModal = ref(false)

    async function fetchDraftList() {
        await useAgent('private')
            .com.atproto.repo.listRecords({
                repo: accountStore.account.did,
                collection: gridskyCollectionThreadDraft,
            }).then(result => {
                threadDraftList.value = result.data.records.map(record => {
                    const draftId = record.value.draft?.id ?? generateId(8)

                    return useThreadDraftModel({
                        post: {
                            uri: `draft://${draftId}`,
                            author: accountStore.account,
                            indexAt: new Date().toISOString(),
                            embed: {
                                $type: 'app.bsky.embed.images#view',
                                images: record.value.media.map(media => {
                                    return {
                                        id: media.id,
                                        alt: media.alt,
                                        blob: media.blob,
                                        aspectRatio: media.aspectRatio,
                                        thumb: `${accountStore.serviceEndpoint}/xrpc/com.atproto.sync.getBlob?did=${accountStore.account.did}&cid=${media.blob ? deepClone(media.blob)?.ref?.$link : undefined}`
                                    }
                                })
                            },
                            record: {
                                $type: 'app.bsky.feed.post',
                                createdAt: new Date().toISOString(),
                                text: record.value.text,
                                embed: {
                                    $type: 'app.bsky.embed.images',
                                    images: record.value.media.map(media => {
                                        return {
                                            alt: media.alt,
                                        }
                                    })
                                }
                            },
                            replyCount: 0,
                            repostCount: 0,
                            quoteCount: 0,
                            likeCount: 0,
                        },
                        draft: {
                            id: draftId,
                            uri: record.uri,
                            cid: record.cid,
                        },
                    })
                })
            }).catch(e => {
                console.error(e)
            })
    }

    function getThreadDraft(uri: string) {
        return threadDraftList.value.find(thread => {
            return thread.post.uri === uri
        })
    }

    const threadDraftListWithoutSelectedThreads = computed(() => {
        const profileGridStore = useProfileGridStore(accountStore.account.handle)
        const selectedUris = profileGridStore.gridActive.posts;

        return threadDraftList.value.filter(thread => {
            return !selectedUris.includes(thread.post.uri)
        });
    })

    function isValidDraftUri(uri: string): boolean {
        return uri.startsWith('draft://') && threadDraftList.value.some(thread => thread.post.uri === uri);
    }

    function createThreadDraft() {
        threadDraft.value = useThreadDraftModel({
            post: {
                uri: `draft://new`,
                author: accountStore.account,
                indexAt: new Date().toISOString(),
                embed: {
                    $type: 'app.bsky.embed.images#view',
                    images: []
                },
                record: {
                    $type: 'app.bsky.feed.post',
                    createdAt: new Date().toISOString(),
                    embed: {
                        $type: 'app.bsky.embed.images',
                        images: []
                    },
                    text: ''
                },
                replyCount: 0,
                repostCount: 0,
                quoteCount: 0,
                likeCount: 0,
            },
            draft: {
                id: generateId(8),
                uri: '',
                cid: '',
            },
        })
    }

    return {
        threadDraft,
        threadDraftList,
        threadDraftModal,
        threadDraftListWithoutSelectedThreads,
        fetchDraftList,
        getThreadDraft,
        isValidDraftUri,
        createThreadDraft,
    }
})
