<script lang="ts" setup>
const userStore = useUserStore();
const emits = defineEmits<{
  (e: 'signout'): void;
}>();

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
  <section class="relative m-4">
    <span class="flex cursor-pointer justify-center" @click="toggleDropdown">
      <ProfileAvatar v-if="user" :name="user?.name" />
    </span>
    <ul
      v-if="isDropdownOpen"
      class="absolute right-0 z-[1000] mt-1 flex min-w-40 list-none flex-col rounded-md border-transparent bg-[#ffffff80] bg-clip-padding py-2 text-left text-base text-[#212529]"
    >
      <li
        class="clear-both block w-full cursor-pointer px-4 py-1 font-normal hover:bg-[#e9ecef]"
        data-test="view-profile"
        @click="toggleModal"
      >
        View Profile
      </li>
      <li
        class="clear-both block w-full cursor-pointer px-4 py-1 font-normal hover:bg-[#e9ecef]"
        data-test="signout"
        @click="signOut"
      >
        Sign Out
      </li>
    </ul>
  </section>
</template>
