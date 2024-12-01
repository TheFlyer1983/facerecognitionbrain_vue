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
      <!-- <ProfileIcon @signout="signOut" /> -->
       <p @click="signOut">Signed In</p>
    </template>
    <template v-else>
      <p
        class="text-[1.5rem] text-black underline p-4 cursor-pointer opacity-100 transition-opacity duration-[0.15s] ease-in mt-0 mb-4 hover:opactiy-50 hover:transition-opacity hover:duration-[0.15s] hover:ease-in"
        data-test="signin"
        @click="navigateTo('/login')"
      >
        Sign In
      </p>
      <p
        class="text-[1.5rem] text-black underline p-4 cursor-pointer opacity-100 transition-opacity duration-[0.15s] ease-in mt-0 mb-4 hover:opactiy-50 hover:transition-opacity hover:duration-[0.15s] hover:ease-in"
        data-test="register"
        @click="navigateTo('/register')"
      >
        Register
      </p>
    </template>
  </nav>
</template>

