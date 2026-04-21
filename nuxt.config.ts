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
    facePlusPlusApiKey: import.meta.env.NUXT_APP_FACE_PLUS_PLUS_API_KEY,
    facePlusPlusApiSecret: import.meta.env.NUXT_APP_FACE_PLUS_PLUS_API_SECRET,
    facePlusPlusUrl: import.meta.env.NUXT_APP_FACE_PLUS_PLUS_URL,
    public: {
      firebaseAuth: import.meta.env.NUXT_FIREBASE_AUTH_URL,
      firebaseApiKey: import.meta.env.NUXT_FIREBASE_API_KEY,
      firebaseDatabase: import.meta.env.NUXT_FIREBASE_URL,
      firebaseReauth: import.meta.env.NUXT_FIREBASE_REAUTH_URL
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
