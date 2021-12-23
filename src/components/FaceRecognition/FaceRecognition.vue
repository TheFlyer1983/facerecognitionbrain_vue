<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { Box } from '@/store/modules/image/imageTypes';
import { getters } from '@/store/modules/image/image';
import { calculateFaceLocations } from '@/functions/imageFunctions';

const store = useStore();

const imageURL = computed<ReturnType<typeof getters.getImageURL>>(
  () => store.getters['image/getImageURL']
);

const boxes = computed(() => {
  const data: Array<Box> = store.getters['image/getBoxes'];
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
        :src="imageURL"
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
