export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore();

  if (userStore.id) {
    return;
  }

  await userStore.reauthenticate();

  if (!userStore.id) {
    return navigateTo('/login');
  }
});
