import { createStore } from 'vuex';

import { RootState } from './rootTypes';

import imageModule from './modules/image';

export const schema = {
  state: {},
  mutations: {},
  actions: {},
  modules: {
    image: imageModule
  }
};

export default createStore<RootState>(schema);
