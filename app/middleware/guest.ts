export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore();
  const event = useRequestEvent();

  if (!userStore.id) { 
    await userStore.reauthenticate(event);
  }

  if (userStore.id) {
    return navigateTo('/');
  }
});
