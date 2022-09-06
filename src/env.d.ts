/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_APP_API_URL: string;
}

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'particles.vue3';
