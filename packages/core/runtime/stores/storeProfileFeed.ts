import {ProfileFeedModel} from "../models/ProfileFeedModel";
import {useListProfileFeed} from "@gridsky/core/runtime/composables/useListProfileFeed";

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

      model.value = useListProfileFeed({actor: did}, actions)
      model.value.setupWorker()
    }

    return {
      setup,
      model,
    }
  })()
}
