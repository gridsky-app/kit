import {onKeyStroke} from '@vueuse/core'
import {useAppPreferencesStore} from "../stores/useAppPreferencesStore";

export default defineNuxtPlugin({
  async setup(nuxtApp) {
    nuxtApp.hooks.hook('app:mounted', () => {
      const appPreferencesStore = useAppPreferencesStore()

      onKeyStroke(['r', 'R'], (e) => {
        if (document.activeElement !== document.body) {
          return false
        }

        e.preventDefault()

        appPreferencesStore.changeLayoutRounded()
      })

      onKeyStroke(['g', 'G'], (e) => {
        if (document.activeElement !== document.body) {
          return false
        }

        e.preventDefault()

        appPreferencesStore.toggleHelperGuides()
      })

    })
  }
})
