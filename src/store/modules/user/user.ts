import { UserState } from './userTypes';

export const state: UserState = {
  isSignedIn: false,
  isProfileOpen: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
    pet: '',
    age: ''
  }
};

export const getters = {};

export const mutations = {};

export const actions = {};

const userModule = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};

export default userModule;
