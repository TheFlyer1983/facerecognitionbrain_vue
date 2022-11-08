<script setup lang="ts">
import useAvatars from '@/composables/avatars/useAvatars';
import { onMounted } from 'vue';

const props = defineProps<{
  name: string;
}>();

const { avatar, createAvatar } = useAvatars();

onMounted(() => {
  createAvatar(props.name);
});
</script>

<template>
  <div class="avatar d-flex justify-content-center align-items-center">
    {{ avatar }}
  </div>
</template>

<style lang="scss" scoped>
.avatar {
  border-radius: 100%;
  border: 1px solid black;
  display: inline-block;
  height: 4rem;
  width: 4rem;
  font-size: 2.25rem;
  font-weight: bold;
  background-color: #33b2f6;
}
</style>
