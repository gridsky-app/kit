import {AppBskyActorDefs} from "@atproto/api";
import {useAgent} from "@gridsky/core/runtime/composables/useAtproto";
import { useAccountAppearanceStore } from "@gridsky/core/runtime/stores/storeAccountAppearance"
import { useAccountPreferencesStore } from "@gridsky/core/runtime/stores/storeAccountPreferences"
import { useAccountSessionStore } from "@gridsky/core/runtime/stores/storeAccountSession"
import { useAccountGridStore } from "@gridsky/core/runtime/stores/storeAccountGrid"
import { useAccountPremiumStore } from "@gridsky/core/runtime/stores/storeAccountPremium"
import { useSuggestionProfilesStore } from "@gridsky/core/runtime/stores/storeSuggestionProfiles"
import { useAppThemeStore } from "@gridsky/core/runtime/stores/storeAppTheme"
import { useProfileStore } from "@gridsky/core/runtime/stores/storeProfile"
import { useProfileGridStore } from "@gridsky/core/runtime/stores/storeProfileGrid"

export const useAccountStore = defineStore("account", () => {
    const appThemeStore = useAppThemeStore()

    const accountAppearanceStore = useAccountAppearanceStore()
    const accountGridStore = useAccountGridStore()
    const accountPremiumStore = useAccountPremiumStore()
    const accountPreferencesStore = useAccountPreferencesStore()
    const accountSessionStore = useAccountSessionStore()
    const suggestionProfilesStore = useSuggestionProfilesStore()
    const dbCommonStore = useDbCommonStore()

    const account: Ref<any> = ref()
    const serviceEndpoint: Ref<any> = ref()

    async function getAccount(initialFetch: boolean = false) {
        const account = await await useAgent('auto')
          .getProfile({
            actor: accountSessionStore.activeDid
          })
          .then(response => {
            return respone.data
          })

        setAccount(account)

        // update session account data
        // (required during initial run or on switch account)
        accountSessionStore.setSessionAccount(account)

        const profileStore = useProfileStore(account.handle)
        const profileGridStore = useProfileGridStore(account.handle)

        if (initialFetch) {
            await Promise.allSettled([
                profileStore.loadProfile(restoreAccountCallback),
                suggestionProfilesStore.fetchSuggestionProfilesLogged(),
            ])

            await accountPreferencesStore.fetchAccountPreferences()
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
        appThemeStore.setBannerImage(account.value.banner)
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
    persist: {
      storage: window.localStorage
    }
})
