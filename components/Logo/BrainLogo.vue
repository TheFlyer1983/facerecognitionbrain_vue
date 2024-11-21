<script setup lang="ts">
const imagePath = computed(
  () => new URL(`/assets/img/brain.png`, import.meta.url).href
);
</script>

<template>
  <div class="m-8 mt-0 text-center">
    <div
      class="h-[150px] w-[150px] rounded bg-gradient-to-r from-[#ff5edf] to-[#04c8de] shadow-[0_0_8px_2px_rgba(0,0,0,0.2)]"
    >
      <div class="p-4">
        <img :src="imagePath" alt="logo" class="pt-[5px]" />
      </div>
    </div>
  </div>
</template>
