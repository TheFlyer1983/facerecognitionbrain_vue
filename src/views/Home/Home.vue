<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/user';
import Logo from '@/components/Logo/Logo.vue';
import ImageLinkForm from '@/components/ImageLinkForm/ImageLinkForm.vue';
import FaceRecognition from '@/components/FaceRecognition/FaceRecognition.vue';
import Rank from '@/components/Rank/Rank.vue';
import Profile from '@/components/Profile/Profile.vue';

const userStore = useUserStore();

onBeforeMount(() => {
  if (!userStore.user) {
    userStore.getToken();
  }
});

const { user, rank: userRank, isProfileOpen } = storeToRefs(userStore);
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
