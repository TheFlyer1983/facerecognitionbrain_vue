<script setup lang="ts">
const imageStore = useImageStore();

const { imageUrl } = storeToRefs(imageStore);
</script>

<template>
  <div class="flex justify-center">
    <div class="relative mt-2">
      <img v-if="imageUrl" id="inputImage" :src="imageUrl" alt="" />

      <span
        v-for="box in imageStore.boxes"
        :key="box.face_token"
        class="absolute flex cursor-pointer flex-wrap justify-center shadow-[0_0_0_3px_#149df2_inset]"
        :style="`top: ${box.face_rectangle.top}px; left: ${box.face_rectangle.left}px; height: ${box.face_rectangle.height}px; width: ${box.face_rectangle.width}px;`"
      ></span>
    </div>
  </div>
</template>
