<script lang="ts" setup>
import type { UpdateInfo } from '@@/types/user';
import isEmpty from 'lodash.isempty';
import ProfileAvatar from './ProfileAvatar.vue';

const userStore = useUserStore();
const { isProfileOpen, user } = storeToRefs(userStore);

function closeModal() {
  isProfileOpen.value = false;
}

const userName = ref(null);
const age = ref<number | null>(null);
const agePlaceHolderText = computed(() => {
  if (user.value?.age) return user.value.age.toString();
  return '';
});
const pet = ref(null);

async function updateProfile() {
  let userInfo: UpdateInfo = {};

  if (userName.value && userName.value !== user.value?.name)
    userInfo = { ...userInfo, name: userName.value };
  if (age.value && age.value !== user.value?.age)
    userInfo = { ...userInfo, age: age.value };
  if (pet.value && pet.value !== user.value?.pet)
    userInfo = { ...userInfo, pet: pet.value };

  if (!isEmpty(userInfo)) await userStore.updateUser(userInfo);
  closeModal();
}

const showConfirmation = ref(false);

function toggleConfirmation() {
  showConfirmation.value = !showConfirmation.value;
}

async function deleteUser() {
  await userStore.deleteUser();
  navigateTo('/login');
}
</script>

<template>
  <UiModal>
    <article
      class="flex flex-row justify-center rounded-lg border border-black/10 bg-white shadow-[4px_4px_8px_(#000)]"
    >
      <main class="w-[80%] p-8 text-black text-opacity-80">
        <ProfileAvatar v-if="user" :name="user.name" />
        <h1 class="my-[0.67rem] text-[2rem] font-[500]">{{ user?.name }}</h1>
        <h4 class="mb-[0.5rem] text-2xl font-[500]">
          Images Submitted: {{ user?.entries }}
        </h4>
        <p class="mb-4">
          Member Since:
          {{ new Date(`${user?.joined}`).toLocaleDateString('en-GB') }}
        </p>
        <hr class="my-4" />
        <template v-if="showConfirmation">
          <p>Are you sure you want to delete your profile?</p>
          <p>This is cannot be undone!</p>
          <div class="mt-8 flex justify-evenly">
            <button
              class="max-w-[40%] flex-grow cursor-pointer border border-[#0003] bg-[#96CCFF] p-2 font-bold hover:bg-white"
              data-test="confirm"
              @click="deleteUser"
            >
              Yes
            </button>
            <button
              class="max-w-[40%] grow cursor-pointer border border-[#0003] bg-[#ff725c] p-2 font-bold hover:text-white"
              data-test="cancel-delete"
              @click="closeModal"
            >
              No
            </button>
          </div>
        </template>
        <template v-else>
          <label for="user-name" class="my-2 inline-block font-semibold">
            Name:
          </label>
          <input
            id="name"
            v-model="userName"
            type="text"
            name="user-name"
            class="w-full border border-black p-2"
            :placeholder="user?.name"
          />
          <label for="user-age" class="my-2 inline-block font-semibold">
            Age:
          </label>
          <input
            id="age"
            v-model="age"
            type="text"
            name="user-age"
            class="w-full border border-black p-2"
            :placeholder="agePlaceHolderText"
          />
          <label for="user-pet" class="my-2 inline-block font-semibold">
            Pet:
          </label>
          <input
            id="pet"
            v-model="pet"
            type="text"
            name="user-pet"
            class="w-full border border-black p-2"
            :placeholder="user?.pet"
          />
          <div class="mt-4 flex justify-evenly">
            <button
              class="max-w-[40%] grow cursor-pointer border border-[#0003] bg-[#96ccff] p-2 font-bold hover:text-white"
              @click="updateProfile"
            >
              Save
            </button>
            <button
              class="max-w-[40%] grow cursor-pointer border border-[#0003] bg-[#ff725c] p-2 font-bold hover:text-white"
              @click="closeModal"
            >
              Cancel
            </button>
          </div>
          <hr class="my-4" />
          <div class="mt-8 flex justify-evenly">
            <button
              class="max-w-40 grow cursor-pointer border border-[#0003] bg-[#ff725C] p-2 font-bold hover:text-white"
              data-test="delete"
              @click="toggleConfirmation"
            >
              Delete User
            </button>
          </div>
        </template>
      </main>
      <div
        class="mt-4 cursor-pointer text-5xl hover:text-gray-400"
        @click="closeModal"
      >
        &times;
      </div>
    </article>
  </UiModal>
</template>
