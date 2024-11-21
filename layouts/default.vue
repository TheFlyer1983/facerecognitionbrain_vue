<script lang="ts" setup>
// import type { Container } from 'tsparticles-engine';

// function onLoad(container: Container) {
//   // Do something with the container
//   container.pause();
//   setTimeout(() => container.play(), 2000);
// }

// const particlesJson = computed(
//   () => new URL(`/assets/particles/particles.json`, import.meta.url).href
// );
</script>

<template>
  <div>
    <NavBar />
    <slot />
  </div>
</template>

<style scoped>
/* .particles {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  background: linear-gradient(89deg, #ff5edf 0%, #04c8de 100%);
} */
</style>
