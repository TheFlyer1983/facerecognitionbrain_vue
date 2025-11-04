// import { useUserStore } from './user';
import { endpoints } from '@@/constants/api';

export const useImageStore = defineStore('image', () => {
  const { $api } = useNuxtApp();
  const userStore = useUserStore();

  const imageUrl = ref<string | null>(null);
  const boxes = ref<ImageState['boxes']>([]);

  watch(imageUrl, (newUrl) => {
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
      increaseEntries();
    } catch (error) {
      console.error(error);
    }
  }

  async function increaseEntries() {
    if (!userStore.user || !userStore.id) return;

    const requestURL = endpoints.profile.replace(':id', userStore.id);

    try {
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
      console.error(error);
    }
  }

  return {
    imageUrl,
    boxes,
    submitURL
  };
});
