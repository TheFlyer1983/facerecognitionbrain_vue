import { defineStore } from 'pinia';
import { UpdateInfo, User, UserState } from './userTypes';
import {
  LoginInfo,
  LoginResponse,
  RegisterInfo,
  RegisterResponse
} from '@/types';
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
    id: '',
    user: null,
    token: '',
    rank: ''
  }),

  actions: {
    async login(payload: LoginInfo) {
      payload = { ...payload, returnSecureToken: true };

      try {
        const response = await request.post<LoginResponse>(
          endpoints.signin,
          payload,
          {
            params: { key: import.meta.env.VITE_APP_FIREBASE_API_KEY }
          }
        );

        saveAuthTokenInSession(response.data.idToken);
        this.token = response.data.idToken;
        this.id = response.data.localId;

        const success = await this.getUser(response.data.localId);
        if (!success) throw new Error('Error');

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },

    async getUser(userId: string) {
      const requestURL = endpoints.profile.replace(':id', userId);

      try {
        const response = await request.get<User>(requestURL, {
          params: { auth: this.token }
        });

        this.user = response.data;
        this.isSignedIn = true;

        //this.getRank();

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },

    async registerUser(payload: RegisterInfo) {
      const registerPayload = {
        email: payload.email,
        password: payload.password,
        returnSecureToken: true
      };
      try {
        const response = await request.post<RegisterResponse>(
          endpoints.register,
          registerPayload,
          {
            params: { key: import.meta.env.VITE_APP_FIREBASE_API_KEY }
          }
        );

        saveAuthTokenInSession(response.data.idToken);
        this.token = response.data.idToken;
        this.id = response.data.localId;
        await this.createProfile(payload.name);

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },

    async createProfile(name: string) {
      const profilePayload = {
        name,
        entries: 0,
        joined: new Date()
      };

      const requestURL = endpoints.profile.replace(':id', this.id);
      try {
        const response = await request.put(requestURL, profilePayload, {
          params: { auth: this.token }
        });

        this.user = response.data;
      } catch (error) {
        console.log(error);
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
      const requestURL = endpoints.profile.replace(':id', this.id);
      try {
        await request.put(requestURL, payload);

        this.getUser(this.id as string);
      } catch (error) {
        console.error(error);
      }
    },

    async deleteUser() {
      const requestURL = endpoints.profile.replace(':id', this.id);
      try {
        await request.delete(requestURL, { params: { auth: this.token } });

        await request.post(
          endpoints.delete,
          { idToken: this.id },
          { params: { key: import.meta.env.VITE_APP_FIREBASE_API_KEY } }
        );

        this.signout();
      } catch (error) {
        console.error(error);
      }
    }
  }
});
