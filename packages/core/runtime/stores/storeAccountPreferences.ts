import { useAccountStore } from "@gridsky/core/runtime/stores/storeAccount"
import { useAccountAppearanceStore } from "@gridsky/core/runtime/stores/storeAccountAppearance"
import { useAccountFeedGeneratorPreferencesStore } from "@gridsky/core/runtime/stores/storeAccountFeedGeneratorPreferences"

import { useProfileStore } from "@gridsky/core/runtime/stores/storeProfile"
import {useAccountFeedGeneratorPreferencesStore} from "@gridsky/core/runtime/stores/storeAccountFeedGeneratorPreferences";

export const useAccountPreferencesStore = defineStore("account/preferences", () => {
    const accountStore = useAccountStore()
    const accountAppearanceStore = useAccountAppearanceStore()
    const accountFeedGeneratorPreferencesStore = useAccountFeedGeneratorPreferencesStore()

    const preferences: Ref<null | any> = ref([
        {
            $type: "app.bsky.actor.defs#savedFeedsPrefV2",
            items: [
                {
                    type: "feed",
                    value: "at://did:plc:jyrbp7bijccauz4eo5iuwbz5/app.bsky.feed.generator/discover",
                    layout: 'vertical',
                    pinned: true,
                    id: "discover"
                },
                {
                    type: "feed",
                    value: "at://did:plc:jyrbp7bijccauz4eo5iuwbz5/app.bsky.feed.generator/latest",
                    layout: 'grid',
                    pinned: false,
                    id: "latest"
                },
            ]
        }
    ])

    async function fetchAccountPreferences() {
        const accountPreferences = await getAccountPreferences()

        if (accountPreferences && accountPreferences.length > 0) {
            preferences.value = await getAccountPreferences()

            accountFeedGeneratorPreferencesStore.applyFeedGeneratorPreferencesToCommonCache()
        }

        useAccountSearchCategoriesStore().restoreSearchCategories(accountAppearanceStore.appearanceConfig.searchCategories)
        useAccountFeedGeneratorCategoriesStore().restoreFeedGeneratorCategories(accountAppearanceStore.appearanceConfig.feedCategories)
        useAccountSidebarStore().restoreSidebars(accountAppearanceStore.appearanceConfig.sidebars)
    }

    async function updateAccountPreferences() {
        await putAccountPreferences(preferences.value)
    }

    return {
        preferences,
        fetchAccountPreferences,
        updateAccountPreferences,
    }
}, {
    persist: {
        storage: window.localStorage,
    }
})
