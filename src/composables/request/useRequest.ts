import { ref, computed, unref, onMounted, Ref } from 'vue';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import useMaybeRef, { MaybeRef } from '@/composables/common/useMaybeRef';

import request from '@/functions/request';

function useRequest<T>(options: {
  config: MaybeRef<AxiosRequestConfig>;
  onSuccess?: (data: T) => any;
  onCatch?: (error: Error) => any;
  onFulfill?: () => any;
  validateOnMount?: MaybeRef<boolean>;
}) {
  const normalizedOptions = computed(() => ({
    onSuccess: Function.prototype,
    onCatch: Function.prototype,
    onFulfill: Function.prototype,
    validateOnMount: false,
    ...options
  }));
  const isLoading = ref(false);
  const data: Ref<T | null> = ref(null); // * To Avoid Unref<T> because T is generic
  const readonlyIsLoading = computed(() => isLoading.value);
  const unrefConfig = useMaybeRef(normalizedOptions.value.config);
  const unrefValidateOnMount = computed(() =>
    unref(normalizedOptions.value.validateOnMount)
  );

  async function validate() {
    isLoading.value = true;

    try {
      const response = (await request(unrefConfig.value)) as AxiosResponse<T>;

      data.value = response.data;
      normalizedOptions.value.onSuccess(response.data);
    } catch (error) {
      normalizedOptions.value.onCatch(error as Error | AxiosError);
    } finally {
      normalizedOptions.value.onFulfill();
      isLoading.value = false;
    }
  }

  onMounted(() => {
    if (unrefValidateOnMount.value) {
      validate();
    }
  });

  return { data, isLoading: readonlyIsLoading, validate };
}

export default useRequest;
