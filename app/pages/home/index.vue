<script lang="ts" setup>
definePageMeta({
  middleware: 'auth'
});

const userStore = useUserStore();

</script>

<template>
  <div>
    <BrainLogo />
    <div>Main Dashboard</div>
    <Teleport to="body">
      <LazyProfileModal v-if="userStore.isProfileOpen"/>
    </Teleport>
  </div>
</template>
