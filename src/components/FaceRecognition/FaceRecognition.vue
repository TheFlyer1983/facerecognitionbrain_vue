<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useImageStore } from '@/store/image';
import { Box } from '@/store/image/imageTypes';
import { calculateFaceLocations } from '@/functions/imageFunctions';

const imageStore = useImageStore();

const { imageUrl } = storeToRefs(imageStore);

const boxes = computed(() => {
  const data: Array<Box> = imageStore.boxes;
  if (data.length) {
    return calculateFaceLocations(data);
  }
});
</script>

<template>
  <div class="face-recognition">
    <div class="face-recognition-wrapper">
      <img
        id="inputImage"
        :src="imageUrl"
        alt=""
        width="500"
        class="face-recognition-wrapper--image"
      />
      <div
        v-for="box in boxes"
        :key="box.topRow"
        class="face-recognition-wrapper--bounding_box"
        :style="`inset: ${box.topRow}px ${box.rightCol}px ${box.bottomRow}px ${box.leftCol}px`"
      ></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.face-recognition {
  display: flex;
  justify-content: center;

  &-wrapper {
    position: absolute;
    margin-top: var(--spacing-small);

    &--bounding_box {
      position: absolute;
      box-shadow: 0 0 0 3px #149df2 inset;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      cursor: pointer;
    }
  }
}
</style>
