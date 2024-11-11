<script setup lang="ts">
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { isSignedIn } = storeToRefs(userStore);

function signOut() {
  userStore.signout();
  navigateTo('/login');
}
</script>

<template>
  <nav class="flex justify-end">
    <template v-if="isSignedIn">
      <ProfileIcon @signout="signOut" />
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

