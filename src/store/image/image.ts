import { defineStore } from 'pinia';
import { useUserStore } from '../user';
import request from '@/functions/request';
import { ImageState } from './imageTypes';
import { endpoints } from '@/constants';
import { createFaceRecognitionPayload } from '@/functions/imageFunctions';

export const useImageStore = defineStore('image', {
  state: (): ImageState => ({
    imageUrl: '',
    boxes: []
  }),

  actions: {
    async submitURL() {
      const payload = createFaceRecognitionPayload(this.imageUrl);

      try {
        const response = await request.post(endpoints.clarifaiURL, payload);

        this.boxes = response.data.outputs[0].data.regions;
        this.increaseEntries();
      } catch (error) {
        console.error(error);
      }
    },

    async increaseEntries() {
      const userStore = useUserStore();

      if (!userStore.user) return;

      const requestURL = endpoints.profile.replace(':id', userStore.id);

      try {
        const response = await request.patch(
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
  }
});
