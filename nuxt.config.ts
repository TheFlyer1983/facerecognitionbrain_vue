// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
    'dayjs-nuxt'
  ],

  components: [{ path: '~/components', pathPrefix: false }],

  imports: {
    dirs: ['stores', '~~/types']
  },

  css: ['~/assets/css/main.pcss'],

  runtimeConfig: {
    facePlusPlusApiKey: '',
    facePlusPlusApiSecret: '',
    facePlusPlusUrl: '',
    public: {
      firebaseAuth: '',
      firebaseApiKey: '',
      firebaseDatabase: '',
      firebaseReauth: ''
    }
  },

  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' }
      ]
      // link: [
      //   { rel: 'icon', href: '/favicon.ico' },
      //   {
      //     rel: 'stylesheet',
      //     href: 'https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap'
      //   }
      // ]
    }
  },

  vite: {
    optimizeDeps: {
      include: ['lodash/isEmpty'],
      holdUntilCrawlEnd: true
    }
  },

  compatibilityDate: '2024-08-23'
});
