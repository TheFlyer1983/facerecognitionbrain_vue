<script setup lang="ts">
import particlesObject from '@/assets/particles/particles.json';
import Nav from '@/components/Nav/Nav.vue';
</script>

<template>
  <Particles id="tsparticles" class="particles" :options="particlesObject" />
  <Nav />
  <router-view />
</template>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

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
