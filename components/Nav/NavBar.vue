<script setup lang="ts">
const userStore = useUserStore();

// Todo: when adding profile menu
function signOut() {
  userStore.signout();
  navigateTo('/login');
}
</script>

<template>
  <nav class="flex justify-end">
    <template v-if="userStore.isSignedIn">
      <ProfileIcon @signout="signOut" />
    </template>
    <template v-else>
      <p
        class="hover:opactiy-50 mb-4 mt-0 cursor-pointer p-4 text-[1.5rem] text-black underline opacity-100 transition-opacity duration-[0.15s] ease-in hover:transition-opacity hover:duration-[0.15s] hover:ease-in"
        data-test="signin"
        @click="navigateTo('/login')"
      >
        Sign In
      </p>
      <p
        class="hover:opactiy-50 mb-4 mt-0 cursor-pointer p-4 text-[1.5rem] text-black underline opacity-100 transition-opacity duration-[0.15s] ease-in hover:transition-opacity hover:duration-[0.15s] hover:ease-in"
        data-test="register"
        @click="navigateTo('/register')"
      >
        Register
      </p>
    </template>
  </nav>
</template>
