import {defineNuxtModule, createResolver, addComponentsDir, addPlugin, addImportsDir, installModule} from '@nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: '@gridsky/ui'
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    {

      nuxt.options.css.push(resolve('./runtime/styles/index.scss'))

    }

    {

      await installModule('@nuxt/icon')
      await installModule('vuetify-nuxt-module')

    }

    addComponentsDir({
      path: resolve('./runtime/components')
    });

    nuxt.hook('vuetify:registerModule', register => register({
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
    }))

  }
});
