import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import HelloWorld from '@/views/HelloWorld.vue';
import { Routes } from './routes';

export const INITIAL_ROUTE = '/';

const routes: Array<RouteRecordRaw> = [
  {
    path: INITIAL_ROUTE,
    name: 'Index',
    redirect: () => ({ name: Routes.Home })
  },
  {
    path: '/home',
    name: Routes.Home,
    component: HelloWorld,
    props: { msg: 'Hello Vue 3 + TypeScript + Vite' }
  },
  {
    path: '/login',
    name: Routes.Login,
    component: () => import('@/views/Login/Login.vue')
  },
  {
    path: '/register',
    name: Routes.Register,
    component: () => import('@/views/Register/Register.vue')
  }
];

const router = createRouter({
  history: createWebHistory(INITIAL_ROUTE),
  routes
});

export default router;
