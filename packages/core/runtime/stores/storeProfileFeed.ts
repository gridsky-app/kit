import {ProfileFeedModel} from "../models/ProfileFeedModel";

export const useProfileFeedStore = function (
  did: string,
  actions?: {
    storePostsIntoPostsKeyVal?: boolean
  }
) {
  return defineStore(`profile/feed/${did}`, () => {
    const model = ref()

    function setup() {
      if (model.value) return

      model.value = new ProfileFeedModel({actor: did}, actions)
      model.value.setupWorker()
    }

    return {
      setup,
      model,
    }
  })()
}
