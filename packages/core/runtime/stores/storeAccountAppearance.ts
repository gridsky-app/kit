import { useAccountStore } from "@gridsky/core/runtime/stores/storeAccount"
import {deepClone} from "@gridsky/core/runtime/utils/utilObject";
import {appAppearanceConfig} from "../config/appearance";
import {isLogged} from "../utils/utilAccount";

export const useAccountAppearanceStore = defineStore("account/appearance", () => {
    const accountStore = useAccountStore()
    const appearanceConfig = ref(deepClone(appAppearanceConfig))

    function setAccountAppearance(data: any) {
        appearanceConfig.value = data
    }

    const isDark = computed<boolean>(() => {
        if (typeof appearanceConfig.value.theme.dark === 'undefined') {
            return true
        }

        return !!appearanceConfig.value.theme.dark
    })

    async function updateAccountAppearance() {
        await putRecord(
            accountStore.account.did,
            gridskyCollectionPreferences,
            gridskyCollectionPreferencesKeyConfig,
            appearanceConfig.value
        )

        accountStore.updateLocalProfile()
    }

    async function toggleDarkTheme() {
        appearanceConfig.value.theme.dark = !appearanceConfig.value.theme.dark

        if (isLogged()) {
            await updateAccountAppearance()
        }
    }

    return {
        isDark,
        appearanceConfig,
        toggleDarkTheme,
        setAccountAppearance,
        updateAccountAppearance,
    }
}, {
    persist: {
        storage: window.localStorage
    }
})
