import {defineStore} from "pinia";
import {ref} from "vue";

type AppPreferenceLayoutRounded = false | 'lg' | 'xl'

export const useAppPreferencesStore = defineStore("app/preferences", () => {
  const layoutRounded = ref<AppPreferenceLayoutRounded>(false)

  function changeLayoutRounded() {
    const modes: AppPreferenceLayoutRounded[] = [false, 'lg', 'xl']
    const currentIndex = modes.indexOf(layoutRounded.value)
    const nextIndex = (currentIndex + 1) % modes.length
    layoutRounded.value = modes[nextIndex] as AppPreferenceLayoutRounded
  }

  const helperGuides = ref<boolean>(false)

  function toggleHelperGuides() {
    helperGuides.value = !helperGuides.value
  }

  const homePageBackground = ref<boolean>(false)

  function toggleHomePageBackground() {
    homePageBackground.value = !homePageBackground.value
  }

  return {
    layoutRounded,
    changeLayoutRounded,
    helperGuides,
    toggleHelperGuides,
    homePageBackground,
    toggleHomePageBackground,
  }
}, {
  persist: {storage: window.localStorage}
})
