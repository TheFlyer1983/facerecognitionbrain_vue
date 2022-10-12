<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '@/store/modules/user';

import Modal from '@/components/Modal/Modal.vue';
import { UpdateInfo } from '@/store/modules/user/userTypes';
import isEmpty from 'lodash.isempty';
import { useNavigation } from '@/modules/navigation';
import { Routes } from '@/router/routes';

const userStore = useUserStore();
const { navigate } = useNavigation();

function closeModal() {
  userStore.isProfileOpen = false;
}

const user = computed(() => userStore.user);

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
  navigate({ name: Routes.Login });
}
</script>

<template>
  <Modal>
    <div class="profile-modal">
      <article
        class="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 bg-white d-flex justify-content-center"
      >
        <main class="pa4 black-80 w-80">
          <img
            src="http://tachyons.io/img/logo.jpg"
            alt="avatar"
            class="h3 w3 dib"
          />
          <h1>{{ user?.name }}</h1>
          <h4>Images Submitted: {{ user?.entries }}</h4>
          <p>
            Member Since:
            {{ new Date(`${user?.joined}`).toLocaleDateString('en-GB') }}
          </p>
          <hr />
          <template v-if="showConfirmation">
            <p>Are you sure you want to delete your profile?</p>
            <p>This is cannot be undone!</p>
            <div class="button-group mt4">
              <button
                class="b pa2 grow pointer hover-white w-40 bg-light-blue b--black-20"
                @click="deleteUser"
                data-test="confirm"
              >
                Yes
              </button>
              <button
                class="b pa2 grow pointer hover-white w-40 bg-light-red b--black-20"
                @click="closeModal"
                data-test="cancel-delete"
              >
                No
              </button>
            </div>
          </template>
          <template v-else>
            <label for="user-name" class="mv2 fw6">Name:</label>
            <input
              type="text"
              name="user-name"
              id="name"
              class="pa2 ba w-100"
              v-model="userName"
              :placeholder="user?.name"
            />
            <label for="user-age" class="mv2 fw6">Age:</label>
            <input
              type="text"
              name="user-age"
              id="age"
              class="pa2 ba w-100"
              v-model="age"
              :placeholder="agePlaceHolderText"
            />
            <label for="user-pet" class="mv2 fw6">Pet:</label>
            <input
              type="text"
              name="user-pet"
              id="pet"
              class="pa2 ba w-100"
              v-model="pet"
              :placeholder="user?.pet"
            />
            <div class="button-group mt4">
              <button
                class="b pa2 grow pointer hover-white w-40 bg-light-blue b--black-20"
                @click="updateProfile"
              >
                Save
              </button>
              <button
                class="b pa2 grow pointer hover-white w-40 bg-light-red b--black-20"
                @click="closeModal"
              >
                Cancel
              </button>
            </div>
            <hr />
            <div class="button-group mt4">
              <button
                class="b pa2 grow pointer hover-white w-40 bg-light-red b--black-20"
                @click="toggleConfirmation"
                data-test="delete"
              >
                Delete User
              </button>
            </div>
          </template>
        </main>
        <div class="modal-close" @click="closeModal">&times;</div>
      </article>
    </div>
  </Modal>
</template>

<style lang="scss" scoped>
.button-group {
  display: flex;
  justify-content: space-evenly;
}
.modal-close {
  font-size: 3rem;
  font-style: bold;
  cursor: pointer;

  &:hover {
    color: grey;
  }
}
</style>
