import { UserState, UserActionContext } from './userTypes';

import { endpoints } from '@/constants';
import { LoginInfo, RegisterInfo } from '@/types';
import {
  getAuthTokenInSession,
  removeAuthTokenFromSession,
  saveAuthTokenInSession
} from '@/functions/storageFunctions';

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
      commit('setToken', result.token);
      commit('setUserId', result.userId);

      const success = await dispatch('getUser', result.userId as string);
      if (!success) throw new Error('Error');

      return true;
    } catch (error) {
      console.log(error, 'In the error block');
      return false;
    }
  },
  async getUser({ commit, dispatch }: UserActionContext, payload: string) {
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
      commit('toggleSignIn', true);
      dispatch('getRank');
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  async registerUser(
    { commit }: UserActionContext,
    payload: RegisterInfo
  ): Promise<boolean> {
    try {
      const response = await fetch(endpoints.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result as string);

      saveAuthTokenInSession(result.session.token as string);
      commit('setUser', result.register.user);

      return true;
    } catch (error) {
      console.log(error);
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
        const response = await fetch(endpoints.signin, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token
          }
        });

        const result = await response.json();

        if (!response.ok) throw new Error(result as string);

        dispatch('getUser', result.id);
      } catch (error) {
        console.log(error);
      }
    }
  },
  async getRank({ state, commit }: UserActionContext): Promise<void> {
    const token = state.token;
    const entries = state.user?.entries;

    try {
      const response = await fetch(endpoints.rank, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify({
          entries
        })
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result);

      commit('setRank', result);
    } catch (error) {}
  },
  signOut({ commit }: UserActionContext): void {
    removeAuthTokenFromSession();

    commit('clearUser');
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
