import {defineNuxtModule, createResolver, addComponentsDir, addPlugin, addImportsDir, installModule} from '@nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: '@gridsky/ui'
  },
  async setup(options, nuxt) {
    const {resolve} = createResolver(import.meta.url);

    {

      // import components

      addComponentsDir({
        path: resolve('./runtime/components')
      })

    }

    {

      // configure vuetify

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
            VDialog: {
              flat: true
            },
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

      await installModule('vuetify-nuxt-module')

    }

    {

      nuxt.options.css.push(resolve('./runtime/styles/index.scss'))

    }

    {

      // nuxt i18n module

      nuxt.hook('i18n:registerModule', register => {
        register({
          // langDir path needs to be resolved
          langDir: resolve('./i18n'),
          locales: [
            {
              code: 'en',
              file: 'locales/en.ts',
            },
          ]
        })
      })

    }

    {

      // nuxt modules

      await installModule('@nuxtjs/i18n')
      await installModule('@nuxt/fonts')
      await installModule('@nuxt/icon')
      await installModule('nuxt-swiper')

    }

  }
});
