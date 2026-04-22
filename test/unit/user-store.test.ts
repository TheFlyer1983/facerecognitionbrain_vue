/// <reference types="vitest/globals" />

import type { H3Event } from 'h3';
import { createPinia, defineStore, setActivePinia } from 'pinia';
import { ref } from 'vue';

const firebaseAuthUrl = 'https://firebase-auth.test/accounts';
const firebaseDbUrl = 'https://firebase-db.test';
const firebaseApiKey = 'firebase-api-key';

const postMock = vi.fn();
const putMock = vi.fn();
const patchMock = vi.fn();
const deleteMock = vi.fn();
const fetchMock = vi.fn();
const saveRefreshTokenInSessionMock = vi.fn();
const getAuthTokenInSessionMock = vi.fn();
const removeAuthTokenFromSessionMock = vi.fn();
const isAxiosErrorMock = vi.fn();
const isErrorMock = vi.fn();
const requestEvent = {} as H3Event;

describe('useUserStore', () => {
  const signinEndpoint = `${firebaseAuthUrl}:signInWithPassword`;
  const registerEndpoint = `${firebaseAuthUrl}:signUp`;
  const deleteEndpoint = `${firebaseAuthUrl}:delete`;
  const profileEndpoint = (userId: string) => `${firebaseDbUrl}/users/${userId}.json`;

  const makeStore = async () => {
    const { useUserStore } = await import('../../app/stores/user');
    return useUserStore();
  };

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.stubEnv('NUXT_FIREBASE_AUTH_URL', firebaseAuthUrl);
    vi.stubEnv('NUXT_FIREBASE_URL', firebaseDbUrl);
    setActivePinia(createPinia());
    vi.stubGlobal('defineStore', defineStore);
    vi.stubGlobal('ref', ref);
    vi.stubGlobal('$fetch', fetchMock);
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: {
        firebaseAuth: firebaseAuthUrl,
        firebaseApiKey,
        firebaseDatabase: firebaseDbUrl
      }
    }));
    vi.stubGlobal('useNuxtApp', () => ({
      $api: () => ({
        post: postMock,
        put: putMock,
        patch: patchMock,
        delete: deleteMock
      })
    }));
    vi.stubGlobal('useTokenStorage', () => ({
      saveRefreshTokenInSession: saveRefreshTokenInSessionMock,
      getAuthTokenInSession: getAuthTokenInSessionMock,
      removeAuthTokenFromSession: removeAuthTokenFromSessionMock
    }));
    vi.stubGlobal('useErrorTypes', () => ({
      isAxiosError: isAxiosErrorMock,
      isError: isErrorMock
    }));
    getAuthTokenInSessionMock.mockResolvedValue({
      token: 'token-session',
      userId: 'user-session'
    });
    isAxiosErrorMock.mockReturnValue(false);
    isErrorMock.mockReturnValue(false);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('logs in and loads user profile successfully', async () => {
    const store = await makeStore();
    postMock.mockResolvedValueOnce({
      data: {
        idToken: 'token-1',
        refreshToken: 'refresh-1',
        localId: 'user-1'
      }
    });
    fetchMock
      .mockResolvedValueOnce({ name: 'Paul', entries: 2 })
      .mockResolvedValueOnce({ input: '🐣' });

    const result = await store.login({
      email: 'paul@test.dev',
      password: 'secret'
    });

    expect(result).toBe(true);
    expect(postMock).toHaveBeenCalledWith(
      signinEndpoint,
      expect.objectContaining({
        email: 'paul@test.dev',
        password: 'secret',
        returnSecureToken: true
      }),
      { params: { key: firebaseApiKey } }
    );
    expect(saveRefreshTokenInSessionMock).toHaveBeenCalledWith('refresh-1');
    expect(store.token).toBe('token-1');
    expect(store.id).toBe('user-1');
    expect(store.isSignedIn).toBe(true);
    expect(store.user).toEqual({ name: 'Paul', entries: 2 });
    expect(store.rank).toBe('🐣');
  });

  it('returns false when login request fails', async () => {
    const store = await makeStore();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    postMock.mockRejectedValueOnce(new Error('signin failed'));

    const result = await store.login({
      email: 'paul@test.dev',
      password: 'secret'
    });

    expect(result).toBe(false);
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('returns false when login cannot load user', async () => {
    const store = await makeStore();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    postMock.mockResolvedValueOnce({
      data: {
        idToken: 'token-1',
        refreshToken: 'refresh-1',
        localId: 'user-1'
      }
    });
    fetchMock.mockRejectedValueOnce(new Error('profile failed'));

    const result = await store.login({
      email: 'paul@test.dev',
      password: 'secret'
    });

    expect(result).toBe(false);
    expect(saveRefreshTokenInSessionMock).not.toHaveBeenCalled();
    expect(removeAuthTokenFromSessionMock).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('returns false when login gets a null user profile response', async () => {
    const store = await makeStore();
    postMock.mockResolvedValueOnce({
      data: {
        idToken: 'token-1',
        refreshToken: 'refresh-1',
        localId: 'user-1'
      }
    });
    fetchMock.mockResolvedValueOnce(null);

    const result = await store.login({
      email: 'paul@test.dev',
      password: 'secret'
    });

    expect(result).toBe(false);
    expect(saveRefreshTokenInSessionMock).not.toHaveBeenCalled();
    expect(removeAuthTokenFromSessionMock).toHaveBeenCalled();
    expect(store.user).toBeNull();
    expect(store.isSignedIn).toBe(false);
  });

  it('registers user and creates profile', async () => {
    const store = await makeStore();
    postMock.mockResolvedValueOnce({
      data: {
        idToken: 'token-2',
        refreshToken: 'refresh-2',
        localId: 'user-2'
      }
    });
    putMock.mockResolvedValueOnce({
      data: { name: 'New User', entries: 0 }
    });

    await store.registerUser({
      name: 'New User',
      email: 'new@test.dev',
      password: 'secret',
      confirmPassword: 'secret'
    });

    expect(postMock).toHaveBeenCalledWith(
      registerEndpoint,
      {
        email: 'new@test.dev',
        password: 'secret',
        returnSecureToken: true
      },
      { params: { key: firebaseApiKey } }
    );
    expect(putMock).toHaveBeenCalledWith(
      profileEndpoint('user-2'),
      expect.objectContaining({
        name: 'New User',
        entries: 0
      }),
      { params: { auth: 'token-2' } }
    );
    expect(saveRefreshTokenInSessionMock).toHaveBeenCalledWith('refresh-2');
    expect(putMock.mock.invocationCallOrder[0]).toBeLessThan(
      saveRefreshTokenInSessionMock.mock.invocationCallOrder[0]
    );
    expect(store.isSignedIn).toBe(true);
  });

  it('does not persist the refresh token when createProfile fails', async () => {
    const store = await makeStore();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    postMock.mockResolvedValueOnce({
      data: {
        idToken: 'token-2',
        refreshToken: 'refresh-2',
        localId: 'user-2'
      }
    });
    putMock.mockRejectedValueOnce(new Error('put failed'));

    await store.registerUser({
      name: 'New User',
      email: 'new@test.dev',
      password: 'secret',
      confirmPassword: 'secret'
    });

    expect(saveRefreshTokenInSessionMock).not.toHaveBeenCalled();
    expect(removeAuthTokenFromSessionMock).toHaveBeenCalled();
    expect(store.token).toBeNull();
    expect(store.id).toBeNull();
    expect(store.user).toBeNull();
    expect(store.isSignedIn).toBe(false);
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('clears auth state when saving the refresh token fails', async () => {
    const store = await makeStore();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    postMock.mockResolvedValueOnce({
      data: {
        idToken: 'token-2',
        refreshToken: 'refresh-2',
        localId: 'user-2'
      }
    });
    putMock.mockResolvedValueOnce({
      data: { name: 'New User', entries: 0 }
    });
    saveRefreshTokenInSessionMock.mockRejectedValueOnce(
      new Error('session save failed')
    );

    await store.registerUser({
      name: 'New User',
      email: 'new@test.dev',
      password: 'secret',
      confirmPassword: 'secret'
    });

    expect(removeAuthTokenFromSessionMock).toHaveBeenCalled();
    expect(store.token).toBeNull();
    expect(store.id).toBeNull();
    expect(store.user).toBeNull();
    expect(store.isSignedIn).toBe(false);
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('logs when registerUser request fails', async () => {
    const store = await makeStore();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    postMock.mockRejectedValueOnce(new Error('register failed'));

    await store.registerUser({
      name: 'New User',
      email: 'new@test.dev',
      password: 'secret',
      confirmPassword: 'secret'
    });

    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('signs out by clearing token storage and state', async () => {
    const store = await makeStore();
    store.token = 'token-1';
    store.id = 'user-1';
    store.user = { name: 'Paul', entries: 3 } as never;
    store.isSignedIn = true;
    store.isProfileOpen = true;
    store.rank = '🐣';

    await store.signout();

    expect(removeAuthTokenFromSessionMock).toHaveBeenCalled();
    expect(store.token).toBeNull();
    expect(store.id).toBeNull();
    expect(store.user).toBeNull();
    expect(store.isSignedIn).toBe(false);
    expect(store.isProfileOpen).toBe(false);
    expect(store.rank).toBeNull();
  });

  it('reauthenticates and refreshes session successfully', async () => {
    const store = await makeStore();
    getAuthTokenInSessionMock.mockResolvedValueOnce({
      token: 'token-3',
      userId: 'user-3'
    });
    fetchMock
      .mockResolvedValueOnce({ name: 'Reauth User', entries: 4 })
      .mockResolvedValueOnce({ input: '🐥' });

    await store.reauthenticate();

    expect(getAuthTokenInSessionMock).toHaveBeenCalled();
    expect(store.token).toBe('token-3');
    expect(store.id).toBe('user-3');
    expect(store.isSignedIn).toBe(true);
    expect(store.user).toEqual({ name: 'Reauth User', entries: 4 });
    expect(store.rank).toBe('🐥');
    expect(saveRefreshTokenInSessionMock).not.toHaveBeenCalled();
  });

  it('forwards the SSR event during reauthenticate', async () => {
    const store = await makeStore();
    getAuthTokenInSessionMock.mockResolvedValueOnce({
      token: 'token-3',
      userId: 'user-3'
    });
    fetchMock
      .mockResolvedValueOnce({ name: 'Reauth User', entries: 4 })
      .mockResolvedValueOnce({ input: '🐥' });

    await store.reauthenticate(requestEvent);

    expect(getAuthTokenInSessionMock).toHaveBeenCalledWith(requestEvent);
  });

  it('signs out when there is no session to reauthenticate', async () => {
    const store = await makeStore();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    getAuthTokenInSessionMock.mockResolvedValueOnce({ token: null, userId: null });

    await store.reauthenticate();

    expect(removeAuthTokenFromSessionMock).toHaveBeenCalled();
    expect(store.token).toBeNull();
    expect(store.id).toBeNull();
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('forwards the SSR event when reauthenticate falls back to signout', async () => {
    const store = await makeStore();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    getAuthTokenInSessionMock.mockResolvedValueOnce({ token: null, userId: null });

    await store.reauthenticate(requestEvent);

    expect(removeAuthTokenFromSessionMock).toHaveBeenCalledWith(requestEvent);
    errorSpy.mockRestore();
  });

  it('signs out when reauthenticate cannot load a user profile', async () => {
    const store = await makeStore();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    getAuthTokenInSessionMock.mockResolvedValueOnce({
      token: 'token-3',
      userId: 'user-3'
    });
    fetchMock.mockResolvedValueOnce(null);

    await store.reauthenticate();

    expect(removeAuthTokenFromSessionMock).toHaveBeenCalled();
    expect(store.token).toBeNull();
    expect(store.id).toBeNull();
    expect(store.user).toBeNull();
    expect(store.isSignedIn).toBe(false);
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('clears only local state when reauthenticate hits a transient profile error', async () => {
    const store = await makeStore();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    getAuthTokenInSessionMock.mockResolvedValueOnce({
      token: 'token-3',
      userId: 'user-3'
    });
    fetchMock.mockRejectedValueOnce(new Error('profile failed'));

    await store.reauthenticate();

    expect(removeAuthTokenFromSessionMock).not.toHaveBeenCalled();
    expect(store.token).toBeNull();
    expect(store.id).toBeNull();
    expect(store.user).toBeNull();
    expect(store.isSignedIn).toBe(false);
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('updates rank when getRank succeeds', async () => {
    const store = await makeStore();
    store.user = { name: 'Paul', entries: 8 } as never;
    fetchMock.mockResolvedValueOnce({ input: '🦉' });

    await store.getRank();

    expect(fetchMock).toHaveBeenCalledWith('/api/rank/rank', {
      method: 'GET',
      query: { rank: 8 }
    });
    expect(store.rank).toBe('🦉');
  });

  it('logs rank error message when getRank fails with known error type', async () => {
    const store = await makeStore();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const rankError = { data: { message: 'rank failed' } };
    fetchMock.mockRejectedValueOnce(rankError);
    isErrorMock.mockReturnValue(true);

    await store.getRank();

    expect(errorSpy).toHaveBeenCalledWith('rank failed');
    errorSpy.mockRestore();
  });

  it('does not log rank message when getRank fails with unknown error type', async () => {
    const store = await makeStore();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock.mockRejectedValueOnce(new Error('unknown rank failure'));
    isErrorMock.mockReturnValue(false);

    await store.getRank();

    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('returns early on updateUser when id is missing', async () => {
    const store = await makeStore();

    await store.updateUser({ name: 'No ID' });

    expect(patchMock).not.toHaveBeenCalled();
  });

  it('updates user and refreshes profile when id exists', async () => {
    const store = await makeStore();
    store.id = 'user-4';
    store.token = 'token-4';
    patchMock.mockResolvedValueOnce({});
    fetchMock
      .mockResolvedValueOnce({ name: 'Updated', entries: 5 })
      .mockResolvedValueOnce({ input: '🦅' });

    await store.updateUser({ name: 'Updated' });

    expect(patchMock).toHaveBeenCalledWith(
      profileEndpoint('user-4'),
      { name: 'Updated' },
      { params: { auth: 'token-4' } }
    );

    await vi.waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(profileEndpoint('user-4'), {
        params: { auth: 'token-4' }
      });
      expect(store.user).toEqual({ name: 'Updated', entries: 5 });
      expect(store.rank).toBe('🦅');
    });
  });

  it('logs when updateUser request fails', async () => {
    const store = await makeStore();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    store.id = 'user-4';
    store.token = 'token-4';
    patchMock.mockRejectedValueOnce(new Error('patch failed'));

    await store.updateUser({ name: 'Updated' });

    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('returns early on deleteUser when id is missing', async () => {
    const store = await makeStore();

    await store.deleteUser();

    expect(deleteMock).not.toHaveBeenCalled();
  });

  it('deletes user and signs out', async () => {
    const store = await makeStore();
    store.id = 'user-5';
    store.token = 'token-5';
    deleteMock.mockResolvedValueOnce({});
    postMock.mockResolvedValueOnce({});

    await store.deleteUser();

    expect(deleteMock).toHaveBeenCalledWith(profileEndpoint('user-5'), {
      params: { auth: 'token-5' }
    });
    expect(postMock).toHaveBeenCalledWith(
      deleteEndpoint,
      { idToken: 'token-5' },
      { params: { key: firebaseApiKey } }
    );
    expect(removeAuthTokenFromSessionMock).toHaveBeenCalled();
    expect(store.id).toBeNull();
    expect(store.token).toBeNull();
  });

  it('does not sign out when profile deletion fails', async () => {
    const store = await makeStore();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    store.id = 'user-6';
    store.token = 'token-6';
    deleteMock.mockRejectedValueOnce(new Error('delete failed'));

    await expect(store.deleteUser()).rejects.toThrow('delete failed');

    expect(errorSpy).toHaveBeenCalled();
    expect(removeAuthTokenFromSessionMock).not.toHaveBeenCalled();
    expect(store.id).toBe('user-6');
    expect(store.token).toBe('token-6');
    errorSpy.mockRestore();
  });

  it('does not sign out when Firebase account deletion fails', async () => {
    const store = await makeStore();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    store.id = 'user-7';
    store.token = 'token-7';
    deleteMock.mockResolvedValueOnce({});
    postMock.mockRejectedValueOnce(new Error('firebase delete failed'));

    await expect(store.deleteUser()).rejects.toThrow('firebase delete failed');

    expect(deleteMock).toHaveBeenCalledWith(profileEndpoint('user-7'), {
      params: { auth: 'token-7' }
    });
    expect(postMock).toHaveBeenCalledWith(
      deleteEndpoint,
      { idToken: 'token-7' },
      { params: { key: firebaseApiKey } }
    );
    expect(errorSpy).toHaveBeenCalled();
    expect(removeAuthTokenFromSessionMock).not.toHaveBeenCalled();
    expect(store.id).toBe('user-7');
    expect(store.token).toBe('token-7');
    errorSpy.mockRestore();
  });
});
