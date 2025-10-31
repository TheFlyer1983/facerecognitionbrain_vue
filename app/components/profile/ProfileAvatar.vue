<script setup lang="ts">
const props = defineProps<{
  name: string;
}>();

const { avatar, createAvatar } = useAvatars();

onMounted(() => {
  createAvatar(props.name);
});
</script>

<template>
  <div
    class="flex h-16 w-16 items-center justify-center rounded-full border border-black bg-[#33b2f6] text-4xl font-bold"
  >
    {{ avatar }}
  </div>
</template>
