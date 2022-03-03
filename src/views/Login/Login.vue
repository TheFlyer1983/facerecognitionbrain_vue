<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useNavigation } from '@/modules/navigation';
import { Routes } from '@/router/routes';

const store = useStore();
const { navigate } = useNavigation();

const email = ref('');
const password = ref('');

async function onSubmitSignIn(): Promise<void> {
  const loginInfo = {
    email: email.value,
    password: password.value
  };
  const success = await store.dispatch('user/login', loginInfo);
  if (success) {
    navigate({ name: Routes.Home });
  }
}
</script>

<template>
  <article class="login-article">
    <main class="login-article-main">
      <div class="login-article-main-measure">
        <fieldset class="login-article-main-measure-fieldset">
          <legend class="login-article-main-measure-fieldset--legend">
            Sign In
          </legend>
          <div class="login-article-main-measure-fieldset__field">
            <label
              for="email-address"
              class="login-article-main-measure-fieldset__field--label"
            >
              Email
            </label>
            <input
              type="email"
              name="email-address"
              id="email-address"
              v-model="email"
              class="login-article-main-measure-fieldset__field--input"
            />
          </div>
          <div class="login-article-main-measure-fieldset__field">
            <label
              for="password"
              class="login-article-main-measure-fieldset__field--label"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              v-model="password"
              class="login-article-main-measure-fieldset__field--input"
            />
          </div>
        </fieldset>
        <div>
          <input
            type="submit"
            value="Sign in"
            @click="onSubmitSignIn"
            class="login-article-main-measure--submit"
            data-test="submit"
          />
        </div>
        <div class="login-article-main-measure__register">
          <p
            @click="navigate({ name: Routes.Register })"
            class="login-article-main-measure__register--link"
            data-test="register"
          >
            Register
          </p>
        </div>
      </div>
    </main>
  </article>
</template>

<style scoped lang="scss">
.login-article {
  border-radius: 0.5rem;
  border: solid 1px var(--black-10);
  width: 100%;
  max-width: 32rem;
  box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.2);
  margin: 4rem auto;

  @include breakpoint-medium {
    width: 50%;
  }

  @include breakpoint-large {
    width: 25%;
  }

  &-main {
    padding: 2rem;
    color: var(--black-80);

    &-measure {
      max-width: 30em;

      &-fieldset {
        border: solid 1px transparent;
        padding-left: 0;
        padding-right: 0;
        margin-left: 0;
        margin-right: 0;

        &--legend {
          font-size: 3rem;
          font-weight: 600;
          padding-left: 0;
          padding-right: 0;
          margin-left: 0;
          margin-right: 0;
        }

        &__field {
          margin-top: 1rem;

          &--label {
            display: block;
            font-weight: 600;
            line-height: 1.5;
            font-size: 0.875rem;
          }

          &--input {
            -webkit-appearance: none;
            -moz-appearance: none;
            padding: 0.5rem;
            border: solid 1px;
            width: 50%;
            background-color: transparent;

            &:hover {
              background-color: black;
              color: white;
            }
          }
        }
      }

      &--submit {
        -webkit-appearance: none;
        -moz-appearance: none;
        -moz-osx-font-smoothing: grayscale;
        cursor: pointer;
        background-color: transparent;
        border: solid 1px black;
        font-size: 0.875rem;
        display: inline-block;
        backface-visibility: hidden;
        transform: translateZ(0);
        transition: transform 0.25 ease-out;
        padding-left: 1rem;
        padding-right: 1rem;

        &:hover {
          transform: scale(1.05);
        }
      }

      &__register {
        line-height: 1.5;
        margin-top: 1rem;

        &--link {
          cursor: pointer;
          display: block;
          opacity: 1;
          transition: opacity 0.15s ease-in;
          font-size: 0.875rem;
          color: black;
          text-decoration: none;

          &:hover {
            opacity: 0.5;
            transition: opacity 0.15s ease-in;
          }
        }
      }
    }
  }
}
</style>
