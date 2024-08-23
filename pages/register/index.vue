<script setup lang="ts">
const name = ref('');
const email = ref('');
const password = ref('');
</script>

<template>
  <article class="register-article">
    <main class="register-article-main">
      <div class="register-article-main-measure">
        <fieldset class="register-article-main-measure-fieldset">
          <legend class="register-article-main-measure-fieldset--legend">
            Register
          </legend>
          <div class="register-article-main-measure-fieldset__field">
            <label
              for="name"
              class="register-article-main-measure-fieldset__field--label"
            >
              Name
            </label>
            <input
              id="name"
              v-model="name"
              type="text"
              name="name"
              class="register-article-main-measure-fieldset__field--input"
            />
          </div>
          <div lass="register-article-main-measure-fieldset__field">
            <label
              for="email-address"
              class="register-article-main-measure-fieldset__field--label"
            >
              Email
            </label>
            <input
              id="email-address"
              v-model="email"
              type="email"
              name="email-address"
              class="register-article-main-measure-fieldset__field--input"
            />
          </div>
          <div lass="register-article-main-measure-fieldset__field">
            <label
              for="password"
              class="register-article-main-measure-fieldset__field--label"
            >
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              name="password"
              class="register-article-main-measure-fieldset__field--input"
            />
          </div>
        </fieldset>
        <div>
          <input
            type="submit"
            value="Register"
            class="register-article-main-measure--submit"
            data-test="submit"
            @click="onSubmitRegister"
          />
        </div>
      </div>
    </main>
  </article>
</template>

<style scoped lang="scss">
.register-article {
  border-radius: 0.5rem;
  border: solid 1px var(--black-10);
  width: 100%;
  box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.2);
  margin: 4rem auto;
  display: flex;
  justify-content: center;

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
        width: 100%;

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
            text-align: center;
          }

          &--input {
            -webkit-appearance: none;
            -moz-appearance: none;
            padding: 0.5rem;
            border: solid 1px;
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
        display: flex;
        justify-content: center;
        backface-visibility: hidden;
        transform: translateZ(0);
        transition: transform 0.25 ease-out;
        padding-left: 1rem;
        padding-right: 1rem;
        margin: auto;

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
