import { defineStore } from 'pinia';
import { UpdateInfo, User, UserState } from './userTypes';
import {
  LoginInfo,
  LoginResponse,
  RankResponse,
  ReAuthResponse,
  RegisterInfo,
  RegisterResponse
} from '@/types';
import request from '@/functions/request';
import { endpoints, reAuthURL } from '@/constants';
import {
  getAuthTokenInSession,
  removeAuthTokenFromSession,
  saveAuthTokenInSession
} from '@/functions/storageFunctions';
import useErrorTypes from '@/composables/errors/useErrorTypes';

const { isAxiosError } = useErrorTypes();

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

        saveAuthTokenInSession(
          response.data.idToken,
          response.data.refreshToken
        );

        this.token = response.data.idToken;
        this.id = response.data.localId;

        const success = await this.getUser(response.data.localId);
        if (!success) throw new Error('Error');

        return true;
      } catch (error) {
        if (isAxiosError(error)) {
          console.error(error.response?.status);
          return false;
        }
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

        this.getRank();

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

        saveAuthTokenInSession(
          response.data.idToken,
          response.data.refreshToken
        );

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
        this.isSignedIn = true;
      } catch (error) {
        console.log(error);
      }
    },

    async reauthenticate() {
      const { refreshToken } = getAuthTokenInSession();

      if (refreshToken) {
        const payload = {
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        };
        try {
          const response = await request.post<ReAuthResponse>(
            reAuthURL,
            payload,
            {
              params: { key: import.meta.env.VITE_APP_FIREBASE_API_KEY }
            }
          );

          this.token = response.data.id_token;
          this.id = response.data.user_id;
          this.getUser(response.data.user_id);

          saveAuthTokenInSession(
            response.data.id_token,
            response.data.refresh_token
          );
        } catch (error) {
          console.error(error);
        }
      }
    },

    async getRank() {
      const entries = this.user?.entries;

      try {
        const response = await request.get<RankResponse>(endpoints.rank, {
          params: { rank: entries }
        });
        this.rank = response.data.input;
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
        await request.patch(requestURL, payload, {
          params: { auth: this.token }
        });

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
          { idToken: this.token },
          { params: { key: import.meta.env.VITE_APP_FIREBASE_API_KEY } }
        );
      } catch (error) {
        console.error(error);
      } finally {
        this.signout();
      }
    }
  }
});
