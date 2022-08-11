import { UserState, UserActionContext, UpdateInfo } from './userTypes';

import { endpoints } from '@/constants';
import { LoginInfo, RegisterInfo } from '@/types';
import {
  getAuthTokenInSession,
  removeAuthTokenFromSession,
  saveAuthTokenInSession
} from '@/functions/storageFunctions';
import request from '@/functions/request';

export const state: UserState = {
  isSignedIn: false,
  isProfileOpen: false,
  user: null,
  token: '',
  rank: ''
};

export const getters = {
  getUser(state: UserState): UserState['user'] {
    return state.user;
  },
  getToken(state: UserState): UserState['token'] {
    return state.token;
  },
  getIsSignedIn(state: UserState): UserState['isSignedIn'] {
    return state.isSignedIn;
  },
  getRank(state: UserState): UserState['rank'] {
    return state.rank;
  },
  getIsProfileOpen(state: UserState): UserState['isProfileOpen'] {
    return state.isProfileOpen;
  }
};

export const mutations = {
  setUserId(state: UserState, payload: string): void {
    state.user = { ...state.user, id: payload } as UserState['user'];
  },

  setUser(state: UserState, payload: UserState['user']): void {
    state.user = payload;
  },

  toggleSignIn(state: UserState, payload: UserState['isSignedIn']): void {
    state.isSignedIn = payload;
  },

  setToken(state: UserState, payload: UserState['token']): void {
    state.token = payload;
  },

  updateEntries(state: UserState, payload: number): void {
    state.user = { ...state.user, entries: payload } as UserState['user'];
  },

  setRank(state: UserState, payload: UserState['rank']): void {
    state.rank = payload;
  },

  clearUser(state: UserState): void {
    state.user = null;
    state.isSignedIn = false;
  },

  toggleModal(state: UserState): void {
    state.isProfileOpen = !state.isProfileOpen;
  }
};

export const actions = {
  async login(
    { commit, dispatch }: UserActionContext,
    payload: LoginInfo
  ): Promise<boolean> {
    try {
      const response = await request.post(endpoints.signin, payload);

      saveAuthTokenInSession(response.data.token as string);
      commit('setToken', response.data.token);
      commit('setUserId', response.data.userId);

      const success = await dispatch('getUser', response.data.userId as string);
      if (!success) throw new Error('Error');

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  async getUser({ commit, dispatch }: UserActionContext, payload: string) {
    const requestURL = endpoints.getProfile.replace(':id', payload);
    try {
      const response = await request.get(requestURL);

      commit('setUser', response.data);
      commit('toggleSignIn', true);
      dispatch('getRank');
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  async registerUser(
    { commit }: UserActionContext,
    payload: RegisterInfo
  ): Promise<boolean> {
    try {
      const response = await request.post(endpoints.register, payload);

      saveAuthTokenInSession(response.data.session.token as string);
      commit('setUser', response.data.register.user);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  getToken({ commit, dispatch }: UserActionContext) {
    const token = getAuthTokenInSession();

    if (token) {
      commit('setToken', token);
      dispatch('authenticated');
    }
  },
  async authenticated({ state, dispatch }: UserActionContext) {
    const token = state.token;

    if (token) {
      try {
        const response = await request.post(endpoints.signin);

        dispatch('getUser', response.data.id);
      } catch (error) {
        console.error(error);
      }
    }
  },
  async getRank({ state, commit }: UserActionContext): Promise<void> {
    const entries = state.user?.entries;

    try {
      const response = await request.post(endpoints.rank, { entries });
      commit('setRank', response.data);
    } catch (error) {
      console.error(error);
    }
  },
  signOut({ commit }: UserActionContext): void {
    removeAuthTokenFromSession();

    commit('clearUser');
  },
  async updateUser(
    { state, dispatch }: UserActionContext,
    payload: UpdateInfo
  ): Promise<void> {
    try {
      await request.post(`${endpoints.profile}/${state.user?.id}`, {
        formInput: payload
      });

      await dispatch('getUser', state.user?.id);
    } catch (error) {
      console.error(error);
    }
  },

  async deleteUser({ state, commit }: UserActionContext): Promise<void> {
    try {
      await request.delete(`${endpoints.user}/${state.user?.id}`);

      commit('clearUser');
    } catch (error) {
      console.error(error);
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
