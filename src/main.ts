import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import store from './store';
import router from './router';

import Particles from 'particles.vue3';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

const pinia = createPinia();

createApp(App).use(Particles).use(pinia).use(store).use(router).mount('#app');
