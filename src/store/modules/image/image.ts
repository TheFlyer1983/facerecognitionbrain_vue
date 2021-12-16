import { ImageState } from "./imageTypes";

export const state: ImageState = {
  input: '',
  imageUrl: '',
  boxes: []
};

export const getters = {};

export const mutations = {};

export const actions = {};

const imageModule = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};

export default imageModule;
