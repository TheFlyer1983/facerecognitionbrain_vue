<script setup lang="ts">
import { User, UserState } from '@/store/user/userTypes';
import { NonNullableObject } from '@/types';

defineProps<{
  user: NonNullableObject<User>;
  userRank: UserState['rank'];
}>();
</script>

<template>
  <div class="rank d-flex flex-column align-items-center">
    <div>{{ user.name }}, your current entry count is...</div>
    <div class="rank-ranking">{{ user.entries }}</div>
    <div>Rank Badge: {{ userRank }}</div>
  </div>
</template>

<style scoped lang="scss">
.rank {
  text-align: center;
  color: white;
  font-size: 1.5rem;

  &-ranking {
    font-size: 3rem;
  }
}
</style>
