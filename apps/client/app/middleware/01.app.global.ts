import {useAppPageStore} from "../stores/storeAppPage";
import {useDbCommonStore} from "../stores/storeDbCommon";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const appPageStore = useAppPageStore()

  appPageStore.pageLoaded = false

  // initialize gridsky indexed db
  const dbCommonStore = useDbCommonStore()
  await dbCommonStore.openDb()

  return true
})
