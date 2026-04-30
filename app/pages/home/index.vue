<script lang="ts" setup>
definePageMeta({
  middleware: 'auth',
  path: '/'
});

const userStore = useUserStore();

const { user, rank: userRank } = storeToRefs(userStore);
</script>

<template>
  <div>
    <RankComponent v-if="user" :user :user-rank />
    <ImageLinkForm />
    <FaceRecognition />
    <Teleport to="body">
      <LazyProfileModal v-if="userStore.isProfileOpen" />
    </Teleport>
  </div>
</template>
