import { computed, unref, Ref } from 'vue';

export type MaybeRef<T> = T | Ref<T>;

function useMaybeRef<T>(value: MaybeRef<T>) {
  return computed(() => unref(value));
}

export default useMaybeRef;
