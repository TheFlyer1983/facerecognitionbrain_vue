export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();

  if (!userStore.id && to.path !== '/register') {
    return navigateTo('/login');
  }
});
