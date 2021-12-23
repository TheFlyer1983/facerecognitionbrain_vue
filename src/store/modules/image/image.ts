import { endpoints } from "@/constants";
import { UserState } from "../user/userTypes";
import { ImageActionContext, ImageState } from "./imageTypes";

export const state: ImageState = {
  imageUrl: '',
  boxes: []
};

export const getters = {
  getImageURL(state: ImageState): ImageState['imageUrl'] {
    return state.imageUrl;
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
  async submitURL({ state, commit, rootGetters }: ImageActionContext): Promise<void> {
    const token = rootGetters['user/getToken'] as UserState['token'];
    console.log(token);
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
