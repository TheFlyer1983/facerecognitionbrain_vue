export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore();

  if (userStore.id) {
    return;
  }

  console.log('Just about to run reauthenticate')
  await userStore.reauthenticate();

  if (!userStore.id) {
    console.log('hitting')
    return navigateTo('/login');
  }
});
