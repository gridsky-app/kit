import {defineNuxtModule, createResolver, addComponentsDir, addPlugin, addImportsDir, installModule} from '@nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: '@gridsky/core'
  },
  async setup(options, nuxt) {

    {

      await installModule('@vueuse/nuxt')

    }

  }
});
