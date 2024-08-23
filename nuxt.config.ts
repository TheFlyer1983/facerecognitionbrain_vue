// https://nuxt.com/docs/api/configuration/nuxt-config
import path from 'path';

export default defineNuxtConfig({
  modules: [
    '@nuxt/devtools',
    '@nuxt/eslint',
    '@nuxt/test-utils/module',
    [
      'nuxt-typed-router',
      {
        plugins: true
      }
    ],
    'nuxt-particles'
  ],

  particles: {
    mode: 'full',
    lazy: true
  },

  // css: ['~/assets/css/main.scss']

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          charset: false,
          additionalData: `@import '~/assets/scss/main.scss';`
        }
      }
    }
  },

  compatibilityDate: '2024-08-23'
});