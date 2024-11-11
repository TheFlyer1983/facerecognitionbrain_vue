import { endpoints } from '~/constants/api';

export const useUserStore = defineStore('UserStore', () => {
  const { $api } = useNuxtApp();
  const { saveAuthTokenInSession } = useTokenStorage();
  const token = ref<string | null>(null);
  const id = ref<string | null>(null);
  const user = ref<User | null>(null);
  const isSignedIn = ref(false);

  async function login(payload: LoginInfo) {
    payload = { ...payload, returnSecureToken: true };

    try {
      const response = await $api().post<LoginResponse>(
        endpoints.signin,
        payload,
        {
          params: { key: import.meta.env.VITE_APP_FIREBASE_API_KEY }
        }
      );

      saveAuthTokenInSession(response.data.idToken, response.data.refreshToken);

      token.value = response.data.idToken;
      id.value = response.data.localId;

      const success = await getUser(response.data.localId);
      if (!success) throw new Error('Error');

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async function getUser(userId: string) {
    const requestURL = endpoints.profile.replace(':id', userId);

    try {
      const response = await $api().get<User>(requestURL, {
        params: { auth: token.value }
      });

      user.value = response.data;
      isSignedIn.value = true;

      // getRank();

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async function registerUser(payload: RegisterInfo) {
    const registerPayload = {
      email: payload.email,
      password: payload.password,
      returnSecureToken: true
    };
    try {
      const response = await $api().post<RegisterResponse>(
        endpoints.register,
        registerPayload,
        {
          params: { key: import.meta.env.VITE_APP_FIREBASE_API_KEY }
        }
      );

      saveAuthTokenInSession(response.data.idToken, response.data.refreshToken);

      token.value = response.data.idToken;
      id.value = response.data.localId;
      await createProfile(payload.name);
    } catch (error) {
      console.error(error);
    }
  }

  async function createProfile(name: string) {
    const profilePayload = {
      name,
      enties: 0,
      joined: new Date()
    };

    const requestURL = endpoints.profile.replace(':id', id.value!);

    try {
      const response = await $api().put<User>(requestURL, profilePayload, {
        params: { auth: token.value }
      });

      user.value = response.data;
      isSignedIn.value = true;
    } catch (error) {
      console.log(error);
    }
  }

  function signout() {
    removeAuthTokenFromSession();
    reset();
  }

  function reset() {
    token.value = null;
    id.value = null;
    user.value = null;
    isSignedIn.value = false;
  }
  return { id, token, registerUser, login, isSignedIn, signout };
});
