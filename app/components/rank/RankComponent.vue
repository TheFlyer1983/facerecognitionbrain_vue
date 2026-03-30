<script setup lang="ts">
import type { User, UserState } from '@@/types/user';
import type { NonNullableObject } from '@@/types';

defineProps<{
  user: NonNullableObject<User>;
  userRank: UserState['rank'];
}>();
</script>

<template>
  <div class="flex flex-col items-center text-center text-2xl text-white">
    <div>{{ user.name }}, your current entry count is...</div>
    <div class="text-5xl">{{ user.entries }}</div>
    <div>Rank Badge: {{ userRank }}</div>
  </div>
</template>
