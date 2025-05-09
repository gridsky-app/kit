import {useProfileStore} from "@gridsky/core/runtime/stores/storeProfile"
import {isRouteProfile, isRouteFeed, isRouteProfilePost} from "@gridsky/core/runtime/utils/utilRoute"

export default defineNuxtRouteMiddleware(async (to: any, from: any) => {
  if (to.path.startsWith('/demo')) {
    return
  }

  if (!isRouteProfile(to) && !isRouteProfilePost(to)) {
    return
  }

  const profileStore = useProfileStore(to.params.handle)

  await profileStore.resolveDid()
  await profileStore.resolveServiceEndpoint()

  return true

})
