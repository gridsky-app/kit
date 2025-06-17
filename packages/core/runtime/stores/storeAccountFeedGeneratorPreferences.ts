import { useAccountPreferencesStore } from "@gridsky/core/runtime/stores/storeAccountPreferences"

import {getFeedGeneratorDetailsCache} from "../utils/utilFeedGenerator";
import {isLogged} from "@gridsky/core/runtime/utils/utilAccount";

export const useAccountFeedGeneratorPreferencesStore = defineStore("account/feed/preferences", () => {
    const typeFeedPreferences = 'app.bsky.actor.defs#savedFeedsPrefV2'

    const accountPreferencesStore = useAccountPreferencesStore()

    const feedPreferences: ComputedRef<FeedGeneratorPreferences[]> = computed(() => {
        if (!accountPreferencesStore.preferences) {
            return []
        }

        const data = accountPreferencesStore
            .preferences
            .find(p => p.$type === typeFeedPreferences)

        if (!data) {
            return []
        }

        return data.items
    })

    // we have getFeedGeneratorPreferences as utils but also a computed fn
    function feedGeneratorPreferences(uri: string) {
        return computed(() => {
            if (feedPreferences.value.length > 0) {
                const feedGeneratorPreferences = feedPreferences.value.find(f => f.value === uri)

                if (feedGeneratorPreferences) {
                    return feedGeneratorPreferences
                }
            }

            if (uri === 'at://did:plc:jyrbp7bijccauz4eo5iuwbz5/app.bsky.feed.generator/discover') {
                return reactive({
                    type: 'feed',
                    layout: false,
                    pinned: true
                })
            }

            if (uri === 'at://did:plc:jyrbp7bijccauz4eo5iuwbz5/app.bsky.feed.generator/latest') {
                return reactive({
                    type: 'feed',
                    layout: false,
                    pinned: true
                })
            }

            return reactive({
                type: 'feed',
                layout: false,
                pinned: false
            })
        }).value
    }

    async function cacheAccountFollowedFeedGenerators() {
        const feedUris = feedPreferences.value
            .filter(f => f.type === 'feed')
            .map(f => f.value)

        if (feedUris.length > 0) {
            const feedGeneratorsDetails = await getFeedGeneratorsDetails(feedUris)

            // put in cache feed-generator details (prepopulate store)
            putFeedGeneratorsDetailsInCache(feedGeneratorsDetails)
        }
    }

    function updateFeedPreferences(preferences: FeedGeneratorPreferences[]) {
        if (!accountPreferencesStore.preferences) {
            return []
        }

        const data = accountPreferencesStore
            .preferences
            .find(p => p.$type === typeFeedPreferences)

        data.items = preferences
    }

    function applyFeedGeneratorPreferencesToCommonCache() {
        feedPreferences.value.forEach((feedGeneratorPreferences) => {
            if (feedGeneratorPreferences.value === 'following') {

            } else {
                getFeedGeneratorDetailsCache(feedGeneratorPreferences.value)
                    .then(feedGeneratorDetails => {
                        feedGeneratorDetails.layout = feedGeneratorPreferences.layout
                    })
            }
        })
    }

    // should show following feeds?
    const isFeedFollowingPinned = computed(() => {
        if (!isLogged()) {
            return true
        }

        if (!accountPreferencesStore.preferences) {
            return true
        }

        const data = accountPreferencesStore
            .preferences

            .find(p => p.$type === typeFeedPreferences)

        if (!data) {
            return true
        }

        const feedFollowingPreferences = data.items.filter(p => p.type === 'timeline')

        if (feedFollowingPreferences.length > 0) {
            return feedFollowingPreferences[0].pinned
        }

        return true
    })

    return {
        feedPreferences,
        isFeedFollowingPinned,
        feedGeneratorPreferences,
        cacheAccountFollowedFeedGenerators,
        updateFeedPreferences,
        applyFeedGeneratorPreferencesToCommonCache,
    }
}, {
    persist: {
        storage: window.localStorage
    }
})
