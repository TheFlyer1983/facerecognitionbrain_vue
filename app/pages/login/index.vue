<script setup lang="ts">
const userStore = useUserStore();

const email = ref('');
const password = ref('');

async function onSubmitSignIn(): Promise<void> {
  const loginInfo = {
    email: email.value,
    password: password.value
  };

  await userStore.login(loginInfo);

  if (userStore.id) {
    await navigateTo('/');
  }
}
</script>

<template>
  <UiLoginBox>
    <template #form>
      <legend class="mx-auto px-0 text-5xl font-semibold">Sign In</legend>
      <div class="mt-4">
        <label
          for="email-address"
          class="block text-center text-sm font-semibold"
        >
          Email
        </label>
        <input
          id="email-address"
          v-model="email"
          type="email"
          name="email-address"
          data-test="email"
          class="border border-black bg-transparent p-2 hover:bg-black hover:text-white"
        />
      </div>
      <div class="mt-4">
        <label for="password" class="block text-center text-sm font-semibold">
          Password
        </label>
        <input
          id="password"
          v-model="password"
          type="password"
          name="password"
          data-test="password"
          class="border border-black bg-transparent p-2 hover:bg-black hover:text-white"
        />
      </div>
    </template>
    <template #button>
      <input
        type="submit"
        value="Sign in"
        class="flex cursor-pointer justify-center border border-black bg-transparent px-4 text-sm transition-all duration-[0.25] ease-out hover:scale-105"
        data-test="submit"
        @click="onSubmitSignIn"
      />
    </template>
    <template #link>
      <p
        class="block cursor-pointer text-sm text-black no-underline opacity-100 transition-opacity duration-[0.15] ease-in hover:opacity-50 hover:transition-opacity hover:duration-[0.15] hover:ease-in"
        data-test="register"
        @click="navigateTo('/register')"
      >
        Register
      </p>
    </template>
  </UiLoginBox>
</template>
