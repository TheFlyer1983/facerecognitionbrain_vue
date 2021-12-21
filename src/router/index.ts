import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import useRouterGuards from './useRouterGuards';

import Home from '@/views/Home/Home.vue';
import { Routes } from './routes';

export const INITIAL_ROUTE = '/';

const { authenticated } = useRouterGuards();

const routes: Array<RouteRecordRaw> = [
  {
    path: INITIAL_ROUTE,
    name: 'Index',
    redirect: () => ({ name: Routes.Home })
  },
  {
    path: '/home',
    name: Routes.Home,
    component: Home,
    props: { msg: 'Hello Vue 3 + TypeScript + Vite' },
    beforeEnter: (to, from, next) => authenticated(next)
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
