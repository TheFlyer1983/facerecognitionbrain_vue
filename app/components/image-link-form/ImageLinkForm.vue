<script setup lang="ts">
const imageStore = useImageStore();

const { imageUrl } = storeToRefs(imageStore);

async function submitURL() {
  imageStore.submitURL();
}
</script>

<template>
  <div class="flex flex-col">
    <p class="mx-auto text-2xl">
      This Magic Brain will detect faces in your pictures. Give it a try.
    </p>
    <div class="mx-auto">
      <div
        class="bg-size[40px_60px] mx-auto flex w-[700px] rounded-lg bg-[#fb1] p-8 shadow-[4px_4px_8px_0px_rgba(0,_0,_0,_0.2)]"
      >
        <input
          v-model="imageUrl"
          data-test="input"
          type="text"
          class="mx-auto w-[70%] p-2 text-xl"
        />
        <button
          class="w-[30%] cursor-pointer bg-[#A463F2] p-2 text-xl text-white no-underline transition-colors duration-[0.15s] ease-in hover:scale-105 hover:transform hover:duration-[0.25s] hover:ease-out"
          data-test="submit"
          @click="submitURL"
        >
          Detect
        </button>
      </div>
    </div>
  </div>
</template>
