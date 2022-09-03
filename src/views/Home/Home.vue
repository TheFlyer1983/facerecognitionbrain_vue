<script setup lang="ts">
import { computed, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import Logo from '@/components/Logo/Logo.vue';
import ImageLinkForm from '@/components/ImageLinkForm/ImageLinkForm.vue';
import FaceRecognition from '@/components/FaceRecognition/FaceRecognition.vue';
import Rank from '@/components/Rank/Rank.vue';
import Profile from '@/components/Profile/Profile.vue';

const store = useStore();

onBeforeMount(() => {
  if (!store.getters['user/getUser']) {
    store.dispatch('user/getToken');
  }
});

const user = computed(() => store.getters['user/getUser']);
const userRank = computed(() => store.getters['user/getRank']);

const isProfileOpen = computed(() => store.getters['user/getIsProfileOpen']);
</script>

<template>
  <Logo />
  <Rank :user="user" :userRank="userRank" v-if="user" />
  <ImageLinkForm />
  <FaceRecognition />
  <teleport to="body">
    <Profile v-if="isProfileOpen" />
  </teleport>
</template>
