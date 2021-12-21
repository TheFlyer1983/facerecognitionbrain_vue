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
    path: '/second',
    name: Routes.Second,
    component: () => import('@/views/SecondPage.vue')
  },
  {
    path: '/login',
    name: Routes.Login,
    component: () => import('@/views/Login/Login.vue')
  }
];

const router = createRouter({
  history: createWebHistory(INITIAL_ROUTE),
  routes
});

export default router;
