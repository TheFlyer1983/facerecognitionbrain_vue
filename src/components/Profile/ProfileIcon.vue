<script setup lang="ts">
import { ref } from 'vue';

const isDropdownOpen = ref(false);

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}
</script>

<template>
  <section class="dropdown">
    <span @click="toggleDropdown" class="dropdown-button">
      <img
        src="http://tachyons.io/img/logo.jpg"
        alt="avatar"
        class="dropdown-button-image"
      />
    </span>
    <ul v-if="isDropdownOpen" class="dropdown-menu">
      <li class="dropdown-menu-item">View Profile</li>
      <li class="dropdown-menu-item">Sign Out</li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.dropdown {
  position: relative;
  margin: 1rem;

  &-button {
    display: flex;
    justify-content: flex-end;
    border: none;
    font-size: inherit;

    &-image {
      border-radius: 100%;
      border: 1px solid black;
      display: inline-block;
      height: 4rem;
      width: 4rem;
    }
  }

  &-menu {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    right: 0;
    border: transparent;
    margin-top: 20px;
    background-color: rgba(255, 255, 255, 0.5);
    width: 10rem;
    list-style: none;
    padding-left: auto;
    padding-right: auto;
    padding-top: 1rem;
    border-radius: 5px;

    &-item {
      cursor: pointer;
      padding-bottom: 1rem;
    }
  }
}
</style>
