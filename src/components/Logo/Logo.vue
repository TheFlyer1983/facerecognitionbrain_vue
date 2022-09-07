<script setup lang="ts">
import brain from '@/assets/images/brain.png';
</script>

<template>
  <div class="logo">
    <div class="logo-tilt">
      <div class="logo-tilt-inner">
        <img :src="brain" alt="logo" class="logo-tilt-inner--image" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.logo {
  text-align: center;
  margin: 2rem;
  margin-top: 0;

  &-tilt {
    background: linear-gradient(89deg, #ff5edf 0%, #04c8de 100%);
    border-radius: 0.25rem;
    box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.2);
    height: 150px;
    width: 150px;

    &-inner {
      padding: 1rem;

      &--image {
        padding-top: 5px;
      }
    }
  }
}
</style>
