import { useListNotification } from '@gridsky/core/runtime/composables/useListNotification'

export const useNotificationListStore = defineStore("notification/list", () => {
  const appThemeStore = useAppThemeStore()
  const searchStore = useSearchStore()
  const drawer = ref(false)

  const modelReady = ref(false)
  const model = ref()

  function setup() {
    modelReady.value = true
    model.value = useListNotification()
  }

  function setDrawer(value: boolean) {
    if (!value) {

      drawer.value = false

    } else {

      appThemeStore.navigationDrawerRails = true
      searchStore.drawer = false

      if (searchStore.drawer || !appThemeStore.navigationDrawerRails) {
        setTimeout(() => {
          drawer.value = true
        }, 400)
      } else {
        drawer.value = true
      }

    }
  }

  function toggleDrawer() {
    setDrawer(!drawer.value)
  }

  return {
    modelReady,
    model,
    drawer,
    setup,
    setDrawer,
    toggleDrawer
  }
})
