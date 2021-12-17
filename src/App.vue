<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import particlesObject from '@/assets/particles/particles.json';
</script>

<template>
  <Particles id="tsparticles" class="particles" :options="particlesObject" />
  <img alt="Vue logo" src="./assets/logo.png" />
  <router-view />
</template>

<style>
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
