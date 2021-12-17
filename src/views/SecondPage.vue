<script setup lang="ts">
import { useNavigation } from '@/modules/navigation';
import { Routes } from '@/router/routes';

const { navigate } = useNavigation();

function changePage() {
  navigate({ name: Routes.Home });
}
</script>

<template>
  <p>This is Page 2</p>

  <button @click="changePage">Change Page</button>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
