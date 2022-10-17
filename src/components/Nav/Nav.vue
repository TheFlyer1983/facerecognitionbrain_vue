<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/store/user';
import { useNavigation } from '@/modules/navigation';
import { Routes } from '@/router/routes';
import ProfileIcon from '../Profile/ProfileIcon.vue';

const userStore = useUserStore();
const { navigate } = useNavigation();

const isSignedIn = computed(() => userStore.isSignedIn);

function signOut() {
  userStore.signout();
  navigate({ name: Routes.Login });
}
</script>

<template>
  <nav class="nav">
    <template v-if="isSignedIn">
      <ProfileIcon @signout="signOut" />
    </template>
    <template v-else>
      <p
        class="nav--link"
        @click="navigate({ name: Routes.Login })"
        data-test="signin"
      >
        Sign In
      </p>
      <p
        class="nav--link"
        @click="navigate({ name: Routes.Register })"
        data-test="register"
      >
        Register
      </p>
    </template>
  </nav>
</template>
<style scoped lang="scss">
.nav {
  display: flex;
  justify-content: flex-end;

  &--link {
    font-size: 1.5rem;
    color: black;
    text-decoration: underline;
    padding: 1rem;
    cursor: pointer;
    opacity: 1;
    transition: opacity 0.15s ease-in;
    margin-top: 0;
    margin-bottom: 16px;

    &:hover {
      opacity: 0.5;
      transition: opacity 0.15s ease-in;
    }
  }
}
</style>
