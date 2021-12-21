<script setup lang="ts">
import Tilt from 'vanilla-tilt-vue';
import brain from '@/assets/images/brain.png';
</script>

<template>
  <div class="logo">
    <Tilt :options="{ max: 55 }" class="logo-tilt">
      <div class="logo-tilt-inner">
        <img :src="brain" alt="logo" class="logo-tilt-inner--image">
      </div>
    </Tilt>
  </div>
</template>

<style scoped lang="scss">
.logo{
  margin: 2rem;
  margin-top: 0;

  &-tilt {
    background: linear-gradient(89deg, #FF5EDF 0%, #04C8DE 100%);
    border-radius: .25rem;
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
