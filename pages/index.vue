<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
});
const userStore = useUserStore();

onMounted(() => {
  if (userStore.isSignedIn) {
    navigateTo('/home');
  }
});
</script>

<template>
  <div></div>
</template>
