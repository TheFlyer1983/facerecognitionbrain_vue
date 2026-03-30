<script setup lang="ts">
const userStore = useUserStore();

const name = ref('');
const email = ref('');
const password = ref('');

async function onSubmitRegister() {
  const registerInfo = {
    name: name.value,
    email: email.value,
    password: password.value
  };

  await userStore.registerUser(registerInfo);

  if (userStore.id) {
    navigateTo('/');
  }
}
</script>

<template>
  <UiLoginBox>
    <template #form>
      <legend class="mx-0 px-0 text-5xl font-semibold">Register</legend>
      <div class="mt-4">
        <label
          for="name"
          class="block text-center text-sm font-semibold leading-6"
        >
          Name
        </label>
        <input
          id="name"
          v-model="name"
          type="text"
          name="name"
          class="border border-black bg-transparent p-2 hover:bg-black hover:text-white"
        />
      </div>
      <div class="mt-4">
        <label
          for="email-address"
          class="block text-center text-sm font-semibold leading-6"
        >
          Email
        </label>
        <input
          id="email-address"
          v-model="email"
          type="email"
          name="email-address"
          class="border border-black bg-transparent p-2 hover:bg-black hover:text-white"
        />
      </div>
      <div class="mt-4">
        <label
          for="password"
          class="block text-center text-sm font-semibold leading-6"
        >
          Password
        </label>
        <input
          id="password"
          v-model="password"
          type="password"
          name="password"
          class="border border-black bg-transparent p-2 hover:bg-black hover:text-white"
        />
      </div>
    </template>
    <template #button>
      <input
        type="submit"
        value="Register"
        class="flex cursor-pointer justify-center border border-black bg-transparent px-4 text-sm transition-all duration-[0.25] ease-out hover:scale-105"
        data-test="submit"
        @click="onSubmitRegister"
      />
    </template>
    <template #link>
      <p
        class="block cursor-pointer text-sm text-black no-underline opacity-100 transition-opacity duration-[0.15] ease-in hover:opacity-50 hover:transition-opacity hover:duration-[0.15] hover:ease-in"
        data-test="login"
        @click="navigateTo('/login')"
      >
        Sign In
      </p>
    </template>
  </UiLoginBox>
</template>
