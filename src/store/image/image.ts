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
        // this.increaseEntries();
      } catch (error) {
        console.error(error);
      }
    },

    async increaseEntries() {
      const userStore = useUserStore();

      if (!userStore.user) return;

      try {
        const response = await request.put(endpoints.image, {
          id: userStore.user.id
        });

        userStore.user.entries = response.data.entries;
        userStore.getRank();
      } catch (error) {
        console.error(error);
      }
    }
  }
});
