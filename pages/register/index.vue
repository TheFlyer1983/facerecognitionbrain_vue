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
  <article
    class="mx-auto my-16 flex w-full justify-center rounded-lg border border-black border-opacity-10 shadow-md md:w-1/2 lg:w-1/4"
  >
    <main class="p-8 text-black opacity-80">
      <div class="mw-[30rem] self-center">
        <fieldset class="mx-0 my-2.5 w-full border border-transparent px-0">
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
          <div lass="mt-4">
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
          <div lass="mt-4">
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
        </fieldset>
        <div>
          <input
            type="submit"
            value="Register"
            class="m-auto flex cursor-pointer justify-center border border-black bg-transparent px-4 text-sm transition-all duration-[0.25] ease-out hover:scale-105"
            data-test="submit"
            @click="onSubmitRegister"
          />
        </div>
      </div>
    </main>
  </article>
</template>
