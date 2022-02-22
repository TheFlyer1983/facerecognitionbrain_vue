import { createApp } from 'vue';
import App from './App.vue';
import store from './store'
import router from './router';

import Particles from 'particles.vue3';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

createApp(App)
  .use(Particles)
  .use(store)
  .use(router)
  .mount('#app');
