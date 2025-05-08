import {defineNuxtModule, installModule} from '@nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: '@gridsky/core'
  },
  async setup() {

    {

      await installModule('@nuxtjs/i18n')
      await installModule('@pinia/nuxt')
      await installModule('@vueuse/nuxt')
      await installModule('nuxt-route-meta')
      await installModule('pinia-plugin-persistedstate/nuxt')

    }

  }
});
