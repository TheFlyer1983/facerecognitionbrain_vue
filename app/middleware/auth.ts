export default defineNuxtRouteMiddleware(async (from) => {
  const userStore = useUserStore();
  console.log('In auth middleware', userStore.id);
  console.log('From route:', from.fullPath);
  
  if (userStore.id) {
    return;
  }

  console.log('Just about to run reauthenticate')
  await userStore.reauthenticate();

  if (!userStore.id) {
    return navigateTo('/login');
  }
});
