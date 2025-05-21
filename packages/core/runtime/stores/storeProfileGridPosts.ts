import { ProfilePostsModel } from '../models/ProfilePostsModel.ts'

export const useProfileGridPostsStore = function (profile: BskyProfile, grid: any) {
  return defineStore(`profile/grid/${profile.did}/${grid.name}/posts`, () => {
    const model = ref()

    function setup() {
      if (model.value) {
        return
      }

      model.value = new ProfilePostsModel({
        uris: grid.posts
      }, grid.name)

      model.value.setupWorker()
    }

    return {
      setup,
      model,
    }
  })()
}
