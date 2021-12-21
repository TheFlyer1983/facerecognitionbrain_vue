<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useNavigation } from '@/modules/navigation';
import { Routes } from '@/router/routes';

const store = useStore();
const { navigate } = useNavigation();

const user = computed(() => store.getters['user/getUser']);
console.log(user.value)

defineProps<{ msg: string }>();

const count = ref(0);
</script>

<template>
  <h1>{{ user }}</h1>
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
