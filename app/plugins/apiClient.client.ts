import axios from 'axios';

export default defineNuxtPlugin(() => {
  return {
    provide: {
      api: () => {
        const userStore = useUserStore();

        const client = axios.create();

        client.interceptors.request.use(async (config) => {
          if (!userStore.token) {
            return config;
          }

          if (config.headers) {
            config.headers.Authorization = userStore.token;
          }

          return config;
        });

        return client;
      }
    }
  };
});
