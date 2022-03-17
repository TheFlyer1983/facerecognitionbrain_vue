<script setup lang="ts">
import { getters } from '@/store/modules/image/image';
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const imageURL = computed<ReturnType<typeof getters['getImageURL']>>({
  get: () => store.getters['image/getImageURL'],
  set: (value) => store.commit('image/setImageURL', value)
});

async function submitURL() {
  store.dispatch('image/submitURL')
}
</script>

<template>
  <div class="image-link">
    <p class="image-link--text">
      This Magic Brain will detect faces in your pictures. Give it a try.
    </p>
    <div class="image-link-wrapper">
      <div class="image-link-wrapper-form">
        <input
          type="text"
          v-model="imageURL"
          class="image-link-wrapper-form--input"
        />
        <button @click="submitURL" class="image-link-wrapper-form--button" data-test="submit">Detect</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.image-link {
  &--text {
    font-size: 1.5rem;
  }

  &-wrapper {
    margin-right: auto;
    margin-left: auto;

    &-form {
      display: flex;
      margin-right: auto;
      margin-left: auto;
      width: 700px;
      background: radial-gradient(
            circle farthest-side at 0% 50%,
            #fb1 23.5%,
            rgba(240, 166, 17, 0) 0
          )
          21px 30px,
        radial-gradient(
            circle farthest-side at 0% 50%,
            #b71 24%,
            rgba(240, 166, 17, 0) 0
          )
          19px 30px,
        linear-gradient(
            #fb1 14%,
            rgba(240, 166, 17, 0) 0,
            rgba(240, 166, 17, 0) 85%,
            #fb1 0
          )
          0 0,
        linear-gradient(
            150deg,
            #fb1 24%,
            #b71 0,
            #b71 26%,
            rgba(240, 166, 17, 0) 0,
            rgba(240, 166, 17, 0) 74%,
            #b71 0,
            #b71 76%,
            #fb1 0
          )
          0 0,
        linear-gradient(
            30deg,
            #fb1 24%,
            #b71 0,
            #b71 26%,
            rgba(240, 166, 17, 0) 0,
            rgba(240, 166, 17, 0) 74%,
            #b71 0,
            #b71 76%,
            #fb1 0
          )
          0 0,
        linear-gradient(90deg, #b71 2%, #fb1 0, #fb1 98%, #b71 0%) 0 0 #fb1;
      background-size: 40px 60px;
      padding: 2rem;
      border-radius: 0.5rem;
      box-shadow: 4px 4px 8px 0px rgba(0, 0, 0, 0.2);

      &--input {
        margin-left: auto;
        margin-right: auto;
        padding: 0.5rem;
        font-size: 1.25rem;
        width: 70%;
      }

      &--button {
        cursor: pointer;
        width: 30%;
        font-size: 1.25rem;
        background-color: var(--light-purple);
        padding: var(--spacing-small);
        color: white;
        text-decoration: none;
        transition: color 0.15s ease-in;
        -moz-osx-font-smoothing: grayscale;
        backface-visibility: hidden;
        transform: translateZ(0);
        transition: transform 0.25s ease-out;

        &:hover {
          transform: scale(1.05);
        }
      }
    }
  }
}
</style>
