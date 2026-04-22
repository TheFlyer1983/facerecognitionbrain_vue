import type { H3Event } from 'h3';
import type { RankResponse } from '../../types';
import type { UserState } from '../../types/user';

export const useUserStore = defineStore('UserStore', () => {
  const { $api } = useNuxtApp();
  const {
    public: { firebaseApiKey, firebaseAuth, firebaseDatabase }
  } = useRuntimeConfig();
  const {
    saveRefreshTokenInSession,
    getAuthTokenInSession,
    removeAuthTokenFromSession
  } = useTokenStorage();
  const { isError } = useErrorTypes();
  const token = ref<string | null>(null);
  const id = ref<string | null>(null);
  const user = ref<User | null>(null);
  const isSignedIn = ref(false);
  const isProfileOpen = ref(false);
  const rank = ref<UserState['rank']>(null);

  async function login(payload: LoginInfo) {
    payload = { ...payload, returnSecureToken: true };

    try {
      const response = await $api().post<LoginResponse>(
        `${firebaseAuth}:signInWithPassword`,
        payload,
        {
          params: { key: firebaseApiKey }
        }
      );

      token.value = response.data.idToken;
      id.value = response.data.localId;

      const success = await getUser(id.value);
      if (!success) {
        await reset();
        return false;
      }

      await saveRefreshTokenInSession(response.data.refreshToken);

      return true;
    } catch (error) {
      console.error(error);
      await reset();
      return false;
    }
  }

  async function getUser(userId: string) {
    const requestURL = `${firebaseDatabase}/users/${userId}.json`;

    try {
      const response = await $fetch<User | null>(requestURL, {
        params: { auth: token.value }
      });

      if (!response) {
        return false;
      }

      user.value = response;
      isSignedIn.value = true;

      await getRank();

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
        `${firebaseAuth}:signUp`,
        registerPayload,
        {
          params: { key: firebaseApiKey }
        }
      );
      token.value = response.data.idToken;
      id.value = response.data.localId;
      await createProfile(payload.name, id.value);
      await saveRefreshTokenInSession(response.data.refreshToken);
    } catch (error) {
      console.error(error);
      await reset();
    }
  }

  async function createProfile(name: string, userId: string) {
    const profilePayload = {
      name,
      entries: 0,
      joined: new Date()
    };

    const requestURL = `${firebaseDatabase}/users/${userId}.json`;
    const response = await $api().put<User>(requestURL, profilePayload, {
      params: { auth: token.value }
    });

    user.value = response.data;
    isSignedIn.value = true;
    return true;
  }

  async function signout(event?: H3Event) {
    await reset(event);
  }

  async function reauthenticate(event?: H3Event) {
    try {
      const { token: userToken, userId } = await getAuthTokenInSession(event);

      if (!userToken || !userId) {
        throw new Error('No user token or user id found');
      }

      token.value = userToken;
      id.value = userId;

      const success = await getUser(userId);
      if (!success) {
        throw new Error('Failed to get user');
      }
    } catch (error) {
      console.error(error);

      await signout(event);
    }
  }

  async function getRank() {
    const entries = user.value?.entries || 0;

    try {
      const response = await $fetch<RankResponse>('/api/rank/rank', {
        method: 'GET',
        query: { rank: entries }
      });

      rank.value = response.input;
    } catch (error) {
      if (isError(error)) {
        console.error(error.data?.message);
      }
    }
  }

  async function updateUser(payload: UpdateInfo) {
    if (!id.value) return;

    const requestURL = `${firebaseDatabase}/users/${id.value}.json`;

    try {
      await $api().patch(requestURL, payload, {
        params: { auth: token.value }
      });

      getUser(id.value);
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteUser() {
    if (!id.value) return;

    const requestURL = `${firebaseDatabase}/users/${id.value}.json`;

    try {
      await $api().delete(requestURL, { params: { auth: token.value } });

      await $api().post(
        `${firebaseAuth}:delete`,
        { idToken: token.value },
        { params: { key: firebaseApiKey } }
      );
    } catch (error) {
      console.error(error);
    } finally {
      await signout();
    }
  }

  async function reset(event?: H3Event) {
    try {
      await removeAuthTokenFromSession(event);
    } catch (error) {
      console.error(error);
    } finally {
      token.value = null;
      id.value = null;
      user.value = null;
      isSignedIn.value = false;
      isProfileOpen.value = false;
      rank.value = null;
    }
  }
  return {
    id,
    token,
    registerUser,
    login,
    reauthenticate,
    isSignedIn,
    signout,
    isProfileOpen,
    user,
    updateUser,
    deleteUser,
    rank,
    getRank,
    reset
  };
});
