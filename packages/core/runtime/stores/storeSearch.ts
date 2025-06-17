import { useAppThemeStore } from "@gridsky/core/runtime/stores/storeAppTheme"
import { useNotificationListStore } from "@gridsky/core/runtime/stores/storeNotificationList"

export const useSearchStore = defineStore("search", () => {
  const appThemeStore = useAppThemeStore()
  const notificationListStore = useNotificationListStore()

  const query = ref('')

  const drawer = ref(false)

  function setQuery(q: string) {
    if (!q) {
      return
    }

    query.value = q.trim().toLowerCase()
  }

  function setDrawer(value: boolean) {
    if (!value) {

      drawer.value = false

    } else {

      appThemeStore.navigationDrawerRails = true
      notificationListStore.drawer = false

      if (notificationListStore.drawer || !appThemeStore.navigationDrawerRails) {
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
    drawer,
    query,
    setQuery,
    setDrawer,
    toggleDrawer
  }
})
