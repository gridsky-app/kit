import {defineNuxtModule, installModule} from '@nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: '@gridsky/core'
  },
  async setup() {

    {

      await installModule('@pinia/nuxt')
      await installModule('@vueuse/nuxt')
      await installModule('pinia-plugin-persistedstate/nuxt')

    }

  }
});
