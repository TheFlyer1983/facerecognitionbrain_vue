import { useErrorTypes } from '~~/app/composables/useErrorTypes';

export const useImageStore = defineStore('image', () => {
  const { $api } = useNuxtApp();
  const {
    public: { firebaseDatabase }
  } = useRuntimeConfig();
  const { isAxiosError, isError } = useErrorTypes();
  const userStore = useUserStore();

  const imageUrl = ref<string | null>(null);
  const boxes = ref<ImageState['boxes']>([]);

  watch(imageUrl, () => {
    boxes.value = [];
  });

  async function submitURL() {
    if (!imageUrl.value) return;

    try {
      const response = await $fetch<ImageResponse>('/api/face/face', {
        method: 'POST',
        body: { imageUrl: imageUrl.value }
      });

      boxes.value = response.faces;
      await increaseEntries();
    } catch (error) {
      if (isError(error)) {
        console.error(error.data?.message);
      } else {
        console.error(error);
      } 
    }
  }

  async function increaseEntries() {
    try {
      if (!userStore.user || !userStore.id) return;

      if (!firebaseDatabase) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Internal Server Error',
          message: 'Firebase database is not configured'
        });
      }
      const requestURL = `${firebaseDatabase}/users/${userStore.id}.json`;

      const response = await $api().patch(
        requestURL,
        {
          entries: userStore.user.entries + 1
        },
        { params: { auth: userStore.token } }
      );

      userStore.user.entries = response.data.entries;
      userStore.getRank();
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(error.message);
      } else if (isError(error)) {
        console.error(error.data?.message);
      }

      throw error;
    }
  }

  return {
    imageUrl,
    boxes,
    submitURL
  };
});
