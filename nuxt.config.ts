// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  modules: [
    '@nuxt/devtools',
    '@nuxt/eslint',
    '@nuxt/test-utils/module',
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'storeToRefs']
      }
    ],
    '@nuxtjs/tailwindcss',
    [
      'nuxt-typed-router',
      {
        plugins: true
      }
    ],
    'nuxt-particles'
  ],

  components: [{ path: '~/components', pathPrefix: false }],

  imports: {
    dirs: ['stores', 'types']
  },

  particles: {
    mode: 'full',
    lazy: true
  },

  css: ['~/assets/css/main.pcss'],

  nitro: {
    storage: {
      data: {
        driver: 'fs',
        base: './.data/kv'
      }
    }
  },

  compatibilityDate: '2024-08-23'
});
