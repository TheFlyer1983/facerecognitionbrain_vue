<script setup lang="ts">
const imageStore = useImageStore();

const { imageUrl } = storeToRefs(imageStore);

const boxes = computed(() => {
  const data = imageStore.boxes;
  if (data.length) {
    return calculateFaceLocations(data);
  }
});

</script>

<template>
  <div class="flex justify-center">
    <div class="relative mt-2">
      <img v-if="imageUrl" id="inputImage" :src="imageUrl" alt="" />

      <span
        v-for="box in boxes"
        :key="box.top"
        class="absolute flex cursor-pointer flex-wrap justify-center shadow-[0_0_0_3px_#149df2_inset]"
        :style="`top: ${box.top}px; left: ${box.left}px; height: ${box.height}px; width: ${box.width}px;`"
      ></span>
    </div>
  </div>
</template>
