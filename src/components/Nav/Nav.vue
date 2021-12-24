<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useNavigation } from '@/modules/navigation';
import { Routes } from '@/router/routes';
import ProfileIcon from '../Profile/ProfileIcon.vue';

const store = useStore();
const { navigate } = useNavigation();

const isSignedIn = computed(() => store.getters['user/getIsSignedIn']);

function signOut() {
  store.dispatch('user/signOut');
  navigate({ name: Routes.Login });
}
</script>

<template>
  <nav class="nav">
    <template v-if="isSignedIn">
      <ProfileIcon @signout="signOut" />
    </template>
    <template v-else>
      <p class="nav--link" @click="navigate({ name: Routes.Login })">Sign In</p>
      <p class="nav--link" @click="navigate({ name: Routes.Register })">
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
