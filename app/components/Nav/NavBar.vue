<script setup lang="ts">
const userStore = useUserStore();

// Todo: when adding profile menu
function signOut() {
  userStore.signout();
  navigateTo('/login');
}
</script>

<template>
  <nav class="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
    <BrainLogo />
    <div class="flex flex-wrap justify-center sm:justify-end">
      <template v-if="userStore.isSignedIn">
        <ProfileIcon @signout="signOut" />
      </template>
      <template v-else>
        <p
          class="mb-4 mt-0 cursor-pointer p-4 text-[1.5rem] text-black underline opacity-100 transition-opacity duration-[0.15s] ease-in hover:opacity-50 hover:transition-opacity hover:duration-[0.15s] hover:ease-in"
          data-test="signin"
          @click="navigateTo('/login')"
        >
          Sign In
        </p>
        <p
          class="mb-4 mt-0 cursor-pointer p-4 text-[1.5rem] text-black underline opacity-100 transition-opacity duration-[0.15s] ease-in hover:opacity-50 hover:transition-opacity hover:duration-[0.15s] hover:ease-in"
          data-test="register"
          @click="navigateTo('/register')"
        >
          Register
        </p>
      </template>
    </div>
  </nav>
</template>