import { defineStore } from 'pinia';
import { UpdateInfo, UserState } from './userTypes';
import { LoginInfo, RegisterInfo } from '@/types';
import request from '@/functions/request';
import { endpoints } from '@/constants';
import {
  getAuthTokenInSession,
  removeAuthTokenFromSession,
  saveAuthTokenInSession
} from '@/functions/storageFunctions';

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    isSignedIn: false,
    isProfileOpen: false,
    user: null,
    token: '',
    rank: ''
  }),

  actions: {
    async login(payload: LoginInfo) {
      try {
        const response = await request.post(endpoints.signin, payload);

        saveAuthTokenInSession(response.data.token as string);
        this.token = response.data.token;
        this.user = { ...this.user, id: response.data.userId };

        const success = await this.getUser(response.data.userId);
        if (!success) throw new Error('Error');

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },

    async getUser(userId: string) {
      const requestURL = endpoints.getProfile.replace(':id', userId);

      try {
        const response = await request.get(requestURL);

        this.user = response.data;
        this.isSignedIn = true;

        this.getRank();

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },

    async registerUser(payload: RegisterInfo) {
      try {
        const response = await request.post(endpoints.register, payload);

        saveAuthTokenInSession(response.data.session.token as string);
        this.user = response.data.register.user;

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },

    getToken() {
      const token = getAuthTokenInSession();

      if (token) {
        this.token = token;

        this.authenticated();
      }
    },

    async authenticated() {
      if (this.token) {
        try {
          const response = await request.post(endpoints.signin);

          this.getUser(response.data.id);
        } catch (error) {
          console.error(error);
        }
      }
    },

    async getRank() {
      const entries = this.user?.entries;

      try {
        const response = await request.post(endpoints.rank, { entries });
        this.rank = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    signout() {
      removeAuthTokenFromSession();
      this.$reset();
    },

    async updateUser(payload: UpdateInfo) {
      try {
        await request.post(`${endpoints.profile}/${this.user?.id}`, {
          formInput: payload
        });

        this.getUser(this.user?.id as string);
      } catch (error) {
        console.error(error);
      }
    },

    async deleteUser() {
      try {
        await request.delete(`${endpoints.user}/${this.user?.id}`);

        this.signout();
      } catch (error) {
        console.error(error);
      }
    }
  }
});
