<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/store/user';
import ProfileAvatar from './ProfileAvatar.vue';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const emits = defineEmits(['signout']);

const isDropdownOpen = ref(false);

const { user } = storeToRefs(userStore);

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

function toggleModal() {
  userStore.isProfileOpen = true;
  toggleDropdown();
}

function signOut() {
  emits('signout');
}
</script>

<template>
  <section class="dropdown">
    <span @click="toggleDropdown" class="dropdown-button pointer">
      <ProfileAvatar :name="user?.name" v-if="user" />
    </span>
    <ul v-if="isDropdownOpen" class="dropdown-menu dropdown-menu-right">
      <li
        @click="toggleModal"
        class="dropdown-item pointer"
        data-test="view-profile"
      >
        View Profile
      </li>
      <li @click="signOut" class="dropdown-item pointer" data-test="signout">
        Sign Out
      </li>
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
  }

  &-menu {
    display: flex;
    flex-direction: column;
    right: 0;
    border: transparent;
    margin-top: 1px;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 5px;
  }
}
</style>
