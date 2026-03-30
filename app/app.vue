<template>
  <NuxtLayout>
    <div class="particles py-3">
      <NuxtPage />
    </div>
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
