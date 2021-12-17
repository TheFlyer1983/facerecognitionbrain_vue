import { createApp } from 'vue';
import App from './App.vue';
import store from './store'
import router from './router';

import Particles from 'particles.vue3';

createApp(App)
  .use(Particles)
  .use(store)
  .use(router)
  .mount('#app');
