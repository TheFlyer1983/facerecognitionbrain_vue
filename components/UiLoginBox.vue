<script lang="ts" setup></script>

<template>
  <article class="mx-auto my-16 flex w-full justify-center rounded-lg border border-black border-opacity-10 shadow-md md:w-1/2 lg:w-1/4">
    <main class="p-8 text-black opacity-80">
      <div class="mw-[30rem] self-center">
        <fieldset class="mx-0 my-2.5 w-full border border-transparent px-0">
          <slot name="form"/>
        </fieldset>
      </div>
      <div>
        <slot name="button" />
      </div>
    </main>
  </article>
</template>
