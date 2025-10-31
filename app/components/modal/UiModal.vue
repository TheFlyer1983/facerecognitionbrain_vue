<script setup lang="ts">
const emits = defineEmits(['close-modal']);

function closeModal() {
  emits('close-modal');
}
</script>

<template>
  <div
    class="fixed left-0 top-0 z-[100] flex h-full w-full items-center justify-center bg-white bg-opacity-80"
    data-test="close-modal"
    @click="closeModal"
  >
    <div class="relative z-[110] max-w-[32rem]">
      <slot></slot>
    </div>
  </div>
</template>
