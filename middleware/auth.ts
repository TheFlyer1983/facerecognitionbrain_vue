export default defineNuxtRouteMiddleware(() => {
  const userStore = useUserStore();

  if (!userStore.id) {
    return navigateTo('/register');
  }
});
