<script setup lang="ts">
import particlesObject from '@/assets/particles/particles.json';
</script>

<template>
  <Particles id="tsparticles" class="particles" :options="particlesObject" />
  <router-view />
</template>

<style lang='scss'>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  
}

.particles{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  background: linear-gradient(89deg, #FF5EDF 0%, #04C8DE 100%);
}
</style>
