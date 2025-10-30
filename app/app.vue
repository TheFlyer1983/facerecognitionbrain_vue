<script lang="ts" setup>
const particlesJson = computed(
  () => new URL(`/assets/particles/particles.json`, import.meta.url).href
);

// const userStore = useUserStore();

// onMounted(async () => {
//   await userStore.reauthenticate();
// })
</script>

<template>
  <NuxtLayout>
    <NuxtParticles id="tsparticles" :url="particlesJson" class="particles" />
    <NuxtPage />
  </NuxtLayout>
</template>

<style scoped>
.particles {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  background: linear-gradient(89deg, #ff5edf 0%, #04c8de 100%);
}
</style>
