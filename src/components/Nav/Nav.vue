<script setup lang="ts">
import { useNavigation } from '@/modules/navigation';
import { Routes } from '@/router/routes';

const { navigate } = useNavigation();
</script>

<template>
  <nav class="nav">
    <p class="nav--link" @click="navigate({ name: Routes.Login })">Sign In</p>
    <p class="nav--link" @click="navigate({ name: Routes.Register })">
      Register
    </p>
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
