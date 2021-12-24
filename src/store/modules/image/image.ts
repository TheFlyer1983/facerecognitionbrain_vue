import { endpoints } from '@/constants';
import { UserState } from '../user/userTypes';
import { ImageActionContext, ImageState } from './imageTypes';

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
    dispatch,
    rootGetters
  }: ImageActionContext): Promise<void> {
    const token = rootGetters['user/getToken'] as UserState['token'];
    try {
      const response = await fetch(endpoints.imageURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify({
          input: state.imageUrl
        })
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result);

      commit('setBoxes', result);
      dispatch('increaseEntries');
    } catch (error) {
      console.log(error);
    }
  },

  async increaseEntries({
    commit,
    dispatch,
    rootGetters
  }: ImageActionContext): Promise<void> {
    const token = rootGetters['user/getToken'] as UserState['token'];
    const user = rootGetters['user/getUser'] as UserState['user'];

    try {
      const response = await fetch(endpoints.image, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify({
          id: user?.id
        })
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result);

      commit('user/updateEntries', result.entries, { root: true });
      dispatch('user/getRank', null, { root: true });
    } catch (error) {
      console.log(error);
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
