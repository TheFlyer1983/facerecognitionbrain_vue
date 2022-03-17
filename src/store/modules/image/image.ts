import { endpoints } from '@/constants';
import { UserState } from '../user/userTypes';
import { ImageActionContext, ImageState } from './imageTypes';
import request from '@/functions/request';

export const state: ImageState = {
  imageUrl: '',
  boxes: []
};

export const getters = {
  getImageURL(state: ImageState): ImageState['imageUrl'] {
    return state.imageUrl;
  },

  getBoxes(state: ImageState): ImageState['boxes'] {
    return state.boxes;
  }
};

export const mutations = {
  setImageURL(state: ImageState, payload: ImageState['imageUrl']): void {
    state.imageUrl = payload;
  },

  setBoxes(state: ImageState, payload: ImageState['boxes']): void {
    state.boxes = payload;
  }
};

export const actions = {
  async submitURL({
    state,
    commit,
    dispatch
  }: ImageActionContext): Promise<void> {
    try {
      const response = await request.post(endpoints.imageURL, {
          input: state.imageUrl
        });

      commit('setBoxes', response.data);
      dispatch('increaseEntries');
    } catch (error) {
      console.error(error);
    }
  },

  async increaseEntries({
    commit,
    dispatch,
    rootGetters
  }: ImageActionContext): Promise<void> {
    const user = rootGetters['user/getUser'] as UserState['user'];

    try {
      const response = await request.put(endpoints.image, {
          id: user?.id
        });

      commit('user/updateEntries', response.data.entries, { root: true });
      dispatch('user/getRank', null, { root: true });
    } catch (error) {
      console.error(error);
    }
  }
};

const imageModule = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};

export default imageModule;
