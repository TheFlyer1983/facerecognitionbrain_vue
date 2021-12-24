<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { User } from '@/store/modules/user/userTypes';
import { PropType } from 'vue';
import { NonNullableObject } from '@/types';
defineProps({
  user: {
    type: Object as PropType<NonNullableObject<User>>,
    required: true
  }
});

const store = useStore();

const rank = computed(() => store.getters['user/getRank']);
</script>

<template>
  <div class="rank">
    <div>{{ user.name }}, your current entry count is...</div>
    <div class="rank-ranking">{{ user.entries }}</div>
    <div>Rank Badge: {{ rank }}</div>
  </div>
</template>

<style scoped lang="scss">
.rank {
  color: white;
  font-size: 1.5rem;

  &-ranking {
    font-size: 3rem;
  }
}
</style>
