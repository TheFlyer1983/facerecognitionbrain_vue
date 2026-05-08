export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore();
  const event = useRequestEvent();

  if (!userStore.id) {
    await userStore.reauthenticate(event);
  }

  if (userStore.id) {
    return navigateTo('/');
  }
});
