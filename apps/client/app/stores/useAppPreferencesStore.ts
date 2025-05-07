import {defineStore} from "pinia";
import {ref} from "vue";

type AppPreferenceLayoutRounded = false | 'lg' | 'xl'

export const useAppPreferencesStore = defineStore("app/preferences", () => {
  const layoutRounded = ref<AppPreferenceLayoutRounded>(false)
  const helperGuides = ref<boolean>(false)

  function changeLayoutRounded() {
    const modes: AppPreferenceLayoutRounded[] = [false, 'lg', 'xl']
    const currentIndex = modes.indexOf(layoutRounded.value)
    const nextIndex = (currentIndex + 1) % modes.length
    layoutRounded.value = modes[nextIndex] as AppPreferenceLayoutRounded
  }

  function toggleHelperGuides() {
    helperGuides.value = !helperGuides.value
  }

  return {
    layoutRounded,
    helperGuides,
    changeLayoutRounded,
    toggleHelperGuides,
  }
}, {
  persist: {storage: window.localStorage}
})
