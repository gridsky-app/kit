import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineNuxtConfig } from 'nuxt/config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  workspaceDir: '../../',
  ssr: false,

  future: {
    compatibilityVersion: 4
  },

  css: [
    './app/styles/index.scss',
  ],

  i18n: {
    strategy: 'no_prefix',
  },

  modules: [
    "@gridsky/core",
    "@gridsky/ui"
  ],

  imports: {
    autoImport: true,
  },

  vite: {
    plugins: [nxViteTsPaths()],
  },

  typescript: {
    typeCheck: true,
    tsConfig: {
      extends: '../tsconfig.app.json', // Nuxt copies this string as-is to the `./.nuxt/tsconfig.json`, therefore it needs to be relative to that directory
    },
  },

  devtools: {
    enabled: false
  },
});
