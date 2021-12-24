<script setup lang="ts">
import { computed, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import Logo from '@/components/Logo/Logo.vue'
import ImageLinkForm from '@/components/ImageLinkForm/ImageLinkForm.vue';
import FaceRecognition from '@/components/FaceRecognition/FaceRecognition.vue';
import Rank from '@/components/Rank/Rank.vue';

const store = useStore();

onBeforeMount(() => {
  if (!store.getters['user/getUser']) {
    store.dispatch('user/getToken');
  }
});

const user = computed(() => store.getters['user/getUser']);
</script>

<template>
  <Logo />
  <Rank :user="user" v-if="user"/>
  <ImageLinkForm />
  <FaceRecognition />
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
