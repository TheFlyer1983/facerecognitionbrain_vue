import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

import Particles from 'particles.vue3';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

const pinia = createPinia();

createApp(App).use(Particles).use(pinia).use(router).mount('#app');
