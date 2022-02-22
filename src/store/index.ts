import { createStore } from 'vuex';

import { RootState } from './rootTypes';

import userModule from './modules/user';
import imageModule from './modules/image';

export const schema = {
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user: userModule,
    image: imageModule
  }
};

export default createStore<RootState>(schema);
