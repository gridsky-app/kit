import {useListSuggestionAccounts} from "@gridsky/core/runtime/composables/useListSuggestionAccount";

export const useSuggestionProfilesStore = defineStore("suggestion/profiles", () => {
    const CACHE_EXPIRATION = 1000 * 60 * 10

    const _profiles = ref({
        logged: { list: [], updatedAt: null },
        anon: { list: [], updatedAt: null }
    })

    async function fetchSuggestionProfilesLogged() {
        const model = useListSuggestionAccounts()

        if (model.list.value.length === 0) {
            await model.fetchList()
            const gridskyProfile = await fetchGridskyProfile()

            let profileList = [...model.list.value]

            if (profileList.length > 0) {
                if (canFollowProfile(gridskyProfile)) {
                    profileList.push(gridskyProfile)
                }

                _profiles.value.logged = {
                    list: profileList.slice(0, 5),
                    updatedAt: new Date()
                }
            }
        }
    }

    async function fetchSuggestionProfilesAnon() {
        const online = useOnline()

        async function fetchGridskyNitroProfiles() {
            try {
                const response = await fetch("https://suggestion.gridsky.app/accounts")

                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`)
                }

                return await response.json()
            } catch {
                return []
            }
        }

        if (!online.value || !shouldFetch(_profiles.value.anon.updatedAt)) {
            return
        }

        _profiles.value.anon = {
            list: (await fetchGridskyNitroProfiles()).slice(0, 5),
            updatedAt: new Date()
        }
    }

    async function fetchGridskyProfile() {
        return await getProfile('did:plc:jyrbp7bijccauz4eo5iuwbz5')
    }

    function shouldFetch(updatedAt: string) {
        return !updatedAt || (Date.now() - new Date(updatedAt).getTime()) > CACHE_EXPIRATION
    }

    const profiles = computed(() => {
        const suggestionProfilesLogged = _profiles.value.logged.list
        const suggestionProfilesAnon = _profiles.value.anon.list

        return suggestionProfilesLogged
    })

    return {
        _profiles,
        profiles,
        fetchSuggestionProfilesLogged,
    }
}, {
    persist: { storage: window.localStorage }
})