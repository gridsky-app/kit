import {useListProfilePosts} from "@gridsky/core/runtime/composables/useListProfilePosts";

export const useProfileGridPostsStore = function (profile: BskyProfile, grid: any) {
  return defineStore(`profile/grid/${profile.did}/${grid.name}/posts`, () => {
    const model = ref()

    function setup() {
      if (model.value) {
        return
      }

      model.value = useListProfilePosts(grid.posts, grid.name)
    }

    return {
      setup,
      model,
    }
  })()
}
