<script lang="ts" setup>
definePageMeta({
  middleware: 'auth'
});

const userStore = useUserStore();

const { user, rank: userRank } = storeToRefs(userStore);
</script>

<template>
  <div>
    <BrainLogo />
    <RankComponent :user :userRank v-if="user" />
    <ImageLinkForm />
    <FaceRecognition />
    <Teleport to="body">
      <LazyProfileModal v-if="userStore.isProfileOpen" />
    </Teleport>
  </div>
</template>
