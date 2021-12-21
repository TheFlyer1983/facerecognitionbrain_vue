import { UserState, UserActionContext } from './userTypes';

import { endpoints } from '@/constants';
import { LoginInfo, RegisterInfo } from '@/types';
import {
  getAuthTokenInSession,
  saveAuthTokenInSession
} from '@/functions/storageFunctions';

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

export const getters = {
  getUser(state: UserState): UserState['user'] {
    return state.user;
  }
};

export const mutations = {
  setUserId(state: UserState, payload: UserState['user']['id']): void {
    state.user.id = payload;
  },

  setUser(state: UserState, payload: UserState['user']): void {
    state.user = payload;
  },

  toggleSignIn(state: UserState, payload: UserState['isSignedIn']): void {
    state.isSignedIn = payload;
  }
};

export const actions = {
  async login(
    { commit, dispatch }: UserActionContext,
    payload: LoginInfo
  ): Promise<boolean> {
    try {
      const response = await fetch(endpoints.signin, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result as string);

      saveAuthTokenInSession(result.token as string);
      commit('setUserId', result.userId);
      commit('toggleSignIn', true);
      const success = await dispatch('getUser', result.userId as string);
      if (!success) throw new Error('Error')

      return true;
    } catch (error) {
      console.log(error, 'In the error block');
      return false;
    }
  },
  async getUser({ commit }: UserActionContext, payload: string) {
    const requestURL = endpoints.getProfile.replace(':id', payload);
    const token = getAuthTokenInSession();
    try {
      if (!token) throw new Error('No valid token');
      const response = await fetch(requestURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        }
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result);

      commit('setUser', result);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  async registerUser({ commit }: UserActionContext, payload: RegisterInfo): Promise<boolean> {
    try {
      const response = await fetch(endpoints.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result as string)

      saveAuthTokenInSession(result.session.token as string);
      commit('setUser', result.register.user)

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
};

const userModule = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};

export default userModule;