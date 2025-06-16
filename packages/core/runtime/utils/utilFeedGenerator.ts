import {useAgent} from "@gridsky/core/runtime/composables/useAtproto";
import type {VueI18nTranslation} from "vue-i18n";

export function routeFeed(feedGeneratorDetails: string | any) {
    // todo allow only uris
    if (typeof feedGeneratorDetails === 'string') {
        if (feedGeneratorDetails.includes('/profile')) {
            return feedGeneratorDetails.replace('/profile', '')
        }

        return feedGeneratorDetails
    } else if (typeof feedGeneratorDetails === 'object') {
        if (feedGeneratorDetails.uri === 'following') {
            return '/following'
        }

        const slug = feedGeneratorDetails.uri.split('/')[feedGeneratorDetails.uri.split('/').length - 1];
        return `/${feedGeneratorDetails.creator.handle}/feed/${slug}`
    }
}

export function detectFeedGeneratorTypeFromUri(uri: string) {
    return uri.startsWith('at') ? 'feed' : 'timeline'
}

/**
 * Get feed generator details from atproto
 *
 * @param uri
 */
export async function getFeedGeneratorDetails(uri: string) {
    const atprotoAgent = useAgent('auto')

    return atprotoAgent
        .app.bsky.feed.getFeedGenerator({
            feed: uri
        })
        .then(result => result.data)
}

/**
 * Get multiple feed generator details from atproto
 *
 * @param uris
 */
export async function getFeedGeneratorsDetails(uris: string[]) {
    return useAgent('auto')
        .app.bsky.feed.getFeedGenerators({
            feeds: uris
        })
        .then(result => result.data)
        .then(result => result.feeds)
}

export function detectFeedGeneratorSectionType(uri: string) {
    switch (uri) {
        case 'following':
            return 'timeline'
        default:
            return 'feed'
    }
}

/**
 * Get cached feed generator details if available
 * or cache and return cached feed generator details
 * + support for static feed generators like: following
 *
 * @param uri
 * @param t
 */
export async function getFeedGeneratorDetailsCache(uri: string, t?: VueI18nTranslation): Promise<FeedGeneratorDetails> {
    switch (uri) {
        case 'following':
            return {
                displayName: t ? t(`feed.static.following.title`) : 'following',
                creator: {
                    handle: 'bsky.app'
                },
                uri: 'following',
                layout: 'vertical',
            }
    }

    const feedGeneratorDetailsCacheStore = useFeedGeneratorDetailsCacheStore(uri)

    if (feedGeneratorDetailsCacheStore.details) {
        return feedGeneratorDetailsCacheStore.details
    }

    return await feedGeneratorDetailsCacheStore.fetch()
}

/**
 * Get feeed generator preferences from account preferences
 *
 * @param uri
 */
export function getAccountFeedGeneratorPreferences(uri: string) {
    const accountPreferencesStore = useAccountPreferencesStore()

    const accountSavedFeedsPreferences = accountPreferencesStore.preferences
        ?.find(p => p.$type === 'app.bsky.actor.defs#savedFeedsPrefV2')

    if (accountSavedFeedsPreferences) {
        const feedGeneratorPreferences = accountSavedFeedsPreferences.items.find(f => f.value === uri)

        if (feedGeneratorPreferences) {
            return feedGeneratorPreferences
        }
    }

    return null
}

export async function switchFeedGeneratorLayout(uri: string) {
    const accountPreferencesStore = useAccountPreferencesStore()
    const feedGeneratorDetails = await getFeedGeneratorDetailsCache(uri)

    let feedGeneratorPreferences
    let newLayout = ''

    function determineNewLayout(prevLayout: string) {
        switch (prevLayout) {
            case 'grid':
                newLayout = 'vertical'
                break
            case 'vertical':
                newLayout = 'grid'
                break
            default:
                newLayout = 'grid'
                break
        }

        return newLayout
    }

    // launch section refresh to avoid browser implosion
    useGlobalFeedSectionController().refreshSection()
    scrollToTop()

    switch (uri) {
        case 'following':
            feedGeneratorPreferences = getFeedGeneratorPreferences(uri)

            if (feedGeneratorPreferences) {
                newLayout = determineNewLayout(feedGeneratorPreferences.layout)
            }
            break
        default:
            feedGeneratorDetails.layout = newLayout = determineNewLayout(feedGeneratorDetails.layout)
            break
    }

    if (isLogged()) {
        feedGeneratorPreferences = getFeedGeneratorPreferences(uri)

        if (feedGeneratorPreferences) {
            feedGeneratorPreferences.layout = newLayout

            await accountPreferencesStore.updateAccountPreferences()
        }
    }
}

/**
 * Get feed generator preferences from account
 * + support for static feed generators like:
 * gsky-discover, gsky-latest, bsky-following
 *
 * @param uri
 */
export function getFeedGeneratorPreferences(uri: string) {
    const feedGeneratorPreferences = getAccountFeedGeneratorPreferences(uri)

    if (feedGeneratorPreferences) {
        return feedGeneratorPreferences
    }
}

/**
 * Return if a feed generator is pinned
 *
 * @param uri
 */
export function isFeedGeneratorPinned(uri: string) {
    const feedGeneratorPreferences = getFeedGeneratorPreferences(uri)

    if (feedGeneratorPreferences) {
        return !!feedGeneratorPreferences.pinned
    }

    return false
}

export async function toggleFeedGeneratorPin(uri: string) {
    const accountPreferencesStore = useAccountPreferencesStore()

    const data = accountPreferencesStore.preferences
        ?.find(p => p.$type === 'app.bsky.actor.defs#savedFeedsPrefV2')

    if (data) {
        const feedFound = data.items.find(f => f.value === uri)

        if (feedFound) {
            feedFound.pinned = !feedFound.pinned

            await accountPreferencesStore.updateAccountPreferences()
        } else {
            // add feed generator if missing, but only works for type: 'feed' not timeline
            if (uri.startsWith('at')) {
                await toggleFeedGeneratorFollow(uri)
            }
        }
    }
}

/**
 * Return if a feed generator is followed
 *
 * @param uri
 */
export function isFeedGeneratorFollowed(uri: string) {
    return !!getAccountFeedGeneratorPreferences(uri)
}

export async function toggleFeedGeneratorFollow(uri: string) {
    const accountPreferencesStore = useAccountPreferencesStore()
    const feedGeneratorDetails = await getFeedGeneratorDetailsCache(uri)

    const data = accountPreferencesStore.preferences
        ?.find(p => p.$type === 'app.bsky.actor.defs#savedFeedsPrefV2')

    if (data) {
        const feedIndex = data.items.findIndex(f => f.value === uri)

        if (feedIndex !== -1) {
            data.items.splice(feedIndex, 1)
        } else {
            data.items.push({
                type: "feed",
                value: uri,
                layout: feedGeneratorDetails.layout,
                pinned: true,
                id: crypto.randomUUID()
            })

            // cache feed generator if it's a new feed generator
            // await getFeedGeneratorDetailsCache(uri)
        }

        await accountPreferencesStore.updateAccountPreferences()

        return true
    }

    return false
}

export function isFeedGeneratorCategorized(uri: string) {
    const accountFeedGeneratorCategoriesStore = useAccountFeedGeneratorCategoriesStore()

    return accountFeedGeneratorCategoriesStore.isFeedGeneratorCategorized(uri)
}

export async function toggleFeedGeneratorFromCategory(uri: string) {
    const accountFeedGeneratorCategoriesStore = useAccountFeedGeneratorCategoriesStore()

    if (accountFeedGeneratorCategoriesStore.isFeedGeneratorCategorized(uri)) {
        accountFeedGeneratorCategoriesStore.deleteFeedGenerator(uri)
    } else {
        accountFeedGeneratorCategoriesStore.addFeedGenerator(uri)
    }

    await accountFeedGeneratorCategoriesStore.updateCategories()
}

export function guardFeedGeneratorClick(feedGeneratorUri: string, cb: () => void) {
    guardIsLogged(cb, detectFeedGeneratorTypeFromUri(feedGeneratorUri) === 'timeline' && !isLogged())
}

export function hotPreloadFeedGenerator(data: any) {
    // set details in cache
    useFeedGeneratorDetailsCacheStore(data.uri, data)
}

export function getFirstFeedGeneratorHeaderTabUriFromExploreSection(): string {
    const feedSectionHeaderTabStore = useFeedSectionHeaderTabsStore('explore')

    if (feedSectionHeaderTabStore.headerFeedTabs.length > 0) {
        return feedSectionHeaderTabStore.headerFeedTabs[0] as string
    }

    return 'following'
}

export function putFeedGeneratorsDetailsInCache(feedGeneratorsDetails: FeedGeneratorDetails[]) {
    feedGeneratorsDetails.forEach(feedGeneratorDetails => {
        useFeedGeneratorDetailsCacheStore(feedGeneratorDetails.uri, feedGeneratorDetails)
    })
}