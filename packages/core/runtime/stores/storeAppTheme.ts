import { useAccountStore } from "@gridsky/core/runtime/stores/storeAccount"
import { useAccountAppearanceStore } from "@gridsky/core/runtime/stores/storeAccountAppearance"
import { useSearchStore } from "@gridsky/core/runtime/stores/storeSearch"
import { useNotificationListStore } from "@gridsky/core/runtime/stores/storeNotificationList"
import { useProfileStore } from "@gridsky/core/runtime/stores/storeProfile"
import {appAppearanceConfig} from "@gridsky/core/runtime/config/appearance";
import {deepClone} from "@gridsky/core/runtime/utils/utilObject";
import {STATE_PROFILE_GLOBAL} from "@gridsky/core/runtime/consts/state";

export const useAppThemeStore = defineStore("app/theme", () => {
    const accountStore = useAccountStore()
    const accountAppearanceStore = useAccountAppearanceStore()

    const navigationDrawerRails = ref(false)

    const theme = ref({
        ...appAppearanceConfig.theme
    })
    const banner = ref<{
        gridskyColors: string[]
        enabled: boolean | null
    }>({
        ...appAppearanceConfig.banner,
        enabled: null
    })
    const bannerImage = ref('')

    function apply(mode: string, treatAsPremium: boolean = false) {
        applyTheme(mode, treatAsPremium)
        applyBanner(mode, treatAsPremium)
    }

    function setTheme(data: any) {
        theme.value = deepClone(data)
    }

    function applyTheme(mode: string, treatAsPremium: boolean = false) {
        switch (mode) {
            case 'account':
                if (treatAsPremium) {
                    setTheme(accountAppearanceStore.appearanceConfig.theme)
                } else {
                    resetThemeToDefault()
                }
                break
            case 'profile':
                const profileGlobal = useState<BskyProfile>(STATE_PROFILE_GLOBAL)
                const profile = useProfileStore(profileGlobal.value.handle)

                if (treatAsPremium) {
                    setTheme(profile.appearance.theme)
                } else {
                    resetThemeToDefault()
                }
                break
            default:
                resetThemeToDefault()
                break
        }
    }

    function resetThemeToDefault() {
        setTheme(appAppearanceConfig.theme)
    }

    function setBanner(data: any) {
        if (!data.enabled) {
            data.gridskyColors = deepClone(appAppearanceConfig.banner.gridskyColors)
        }

        banner.value = deepClone(data)
    }

    function setBannerImage(image: string) {
        bannerImage.value = image
    }

    function resetBannerImage() {
        if (accountStore.account) {
            setBannerImage(accountStore.account.banner)
        }
    }

    function applyBanner(mode: string, treatAsPremium: boolean = false) {
        switch (mode) {
            case 'account':
                banner.value.enabled = Boolean(accountAppearanceStore.appearanceConfig.banner.enabled)

                if (treatAsPremium) {
                    setBanner(accountAppearanceStore.appearanceConfig.banner)
                    setBannerImage(accountStore.account.banner)
                } else {
                    resetBannerToDefault()
                }
                break
            case 'profile':
                const profileGlobal = useState<BskyProfile>(STATE_PROFILE_GLOBAL)
                const profileStore = useProfileStore(profileGlobal.value.handle)

                if (treatAsPremium) {
                    setBanner(profileStore.appearance.banner)
                    setBannerImage(profileStore.profile.banner)
                } else {
                    resetBannerToDefault()
                }
                break
            default:
                banner.value.enabled = appAppearanceConfig.banner.enabled
                resetBannerToDefault()
                break
        }
    }

    function resetBannerToDefault() {
        banner.value.gridskyColors = appAppearanceConfig.banner.gridskyColors
        banner.value.gridskyEnabled = true
        banner.value.blueskyEnabled = false
        banner.value.shadertoyEnabled = false
    }

    function reset() {
    }

    function restoreMainDrawer() {
        navigationDrawerRails.value = false

        useNotificationListStore().setDrawer(false)
        useSearchStore().setDrawer(false)
    }

    return {
        navigationDrawerRails,
        theme,
        banner,
        bannerImage,
        setBanner,
        setBannerImage,
        resetBannerImage,
        apply,
        reset,
        restoreMainDrawer,
    }
}, {
    persist: {
        pick: ['dark']
    }
})
