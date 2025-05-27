import {AppBskyActorDefs} from "@atproto/api";
import { useAccountSessionStore } from "@gridsky/core/runtime/stores/storeAccountSession"

export const useAccountStore = defineStore("account", () => {
    const appThemeStore = useAppThemeStore()

    const accountAppearanceStore = useAccountAppearanceStore()
    const accountGridStore = useAccountGridStore()
    const accountPremiumStore = useAccountPremiumStore()
    const accountPreferencesStore = useAccountPreferencesStore()
    const accountSessionStore = useAccountSessionStore()
    const accountBookmarkStore = useAccountBookmarksStore()
    const accountFeedGeneratorPreferencesStore = useAccountFeedGeneratorPreferencesStore()
    const accountSearchCategoriesStore = useAccountSearchCategoriesStore()
    const accountFeedGeneratorCategoriesStore = useAccountFeedGeneratorCategoriesStore()
    const suggestionProfilesStore = useSuggestionProfilesStore()
    const threadDraftListStore = useThreadDraftListStore()
    const dbCommonStore = useDbCommonStore()

    const account: Ref<any> = ref()
    const serviceEndpoint: Ref<any> = ref()

    async function getAccount(completeFetch: boolean = false) {
        const account = await getProfile(accountSessionStore.activeDid)

        setAccount(account)

        // update session account data for account switch
        accountSessionStore.setSessionAccount(account)

        const profileStore = useProfileStore(account.handle)
        const profileGridStore = useProfileGridStore(account.handle)

        if (completeFetch) {
            await Promise.allSettled([
                profileStore.loadProfile(accountSessionStore.activeDid, restoreAccountCallback),
                accountPreferencesStore.fetchAccountPreferences(),
                suggestionProfilesStore.fetchSuggestionProfilesLogged(),
                accountBookmarkStore.getBookmarksBatch(),
            ])

            threadDraftListStore.fetchDraftList()
        }

        function restoreAccountCallback() {
            serviceEndpoint.value = profileStore.serviceEndpoint
            accountPremiumStore.premium = profileStore.premium
            accountAppearanceStore.setAccountAppearance(profileStore.appearance)
            accountGridStore.setAccountGridList(profileGridStore.gridList)
        }
    }

    function setAccount(value: AppBskyActorDefs.ProfileViewDetailed) {
        account.value = value

        // update account in session
        accountSessionStore.setSessionAccount(account.value)

        // set app-theme account banner
        appThemeStore.setBanner(account.value.banner)
    }

    function resetAccount() {
        account.value = undefined
    }

    const isLogged = computed(() => {
        return !!accountSessionStore.activeDid && account.value && account.value.did
    })

    const isPremium = computed(() => {
        if (!accountPremiumStore.premium || !accountPremiumStore.premium.active) {
            return false
        }

        return true
    })

    // todo move to utils
    function isAuthor(profile: BskyProfile) {
        if (!profile) {
            return false
        }

        return account.value && account.value.did === profile.did
    }

    async function updateLocalProfile() {
        const dbInstance = await dbCommonStore.openDb()

        const txFeedGeneratorPopular = dbInstance.transaction('Profile', 'readwrite')
        const storeFeedGeneratorPopular = txFeedGeneratorPopular.store

        const result = await storeFeedGeneratorPopular.get(account.value.did)

        if (!result) {
            throw new Error('Profile not found')
        }

        result.profile = deepClone(account.value)
        result.appearance = deepClone(accountAppearanceStore.appearanceConfig)

        await storeFeedGeneratorPopular.put(result, account.value.did)

        await txFeedGeneratorPopular.done
    }

    return {
        account,
        serviceEndpoint,
        getAccount,
        resetAccount,
        isLogged,
        isPremium,
        isAuthor,
        updateLocalProfile,
    }
}, {
    persist: {storage: window.localStorage}
})
