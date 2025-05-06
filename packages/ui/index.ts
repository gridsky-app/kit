import {defineNuxtModule, createResolver, addComponentsDir, addPlugin, addImportsDir, installModule} from '@nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: '@gridsky/ui'
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    await installModule('vuetify-nuxt-module')

    addComponentsDir({
      path: resolve('./runtime/components')
    });


    nuxt.options.vuetify = {
      moduleOptions: {
        styles: 'sass',
      },
      vuetifyOptions: {
        labComponents: ['VPullToRefresh'],
        theme: {
          defaultTheme: 'dark',
        },
        defaults: {
          VBtn: {
            flat: true
          },
          VCard: {
            flat: true
          },
          VList: {
            flat: true
          },
          VListItem: {
            flat: true
          },
          VField: {
            flat: true
          },
          VTextField: {
            flat: true
          },
          VTextarea: {
            flat: true
          },
          VMenu: {
            flat: true
          },
          VOverlay: {
            elevation: 0
          }
        },
        locale: {
          locale: 'en',
          fallback: 'en',
        },
      }
    };

  }
});
