<script setup lang="ts">
const emits = defineEmits(['close-modal']);

function closeModal() {
  emits('close-modal');
}
</script>

<template>
  <div class="modal position-abosolute d-flex justify-content-center align-items-center">
    <div
      class="modal__overlay position-fixed w-100 h-100 bg-white-80 top-0 start-0"
      @click="closeModal"
      data-test="close-modal"
    ></div>
    <div class="modal__container">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal {
  &__overlay {
    z-index: 100;
  }

  &__container {
    z-index: 110;
  }
}
</style>
