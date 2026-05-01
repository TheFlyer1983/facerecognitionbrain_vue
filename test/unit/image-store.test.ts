/// <reference types="vitest/globals" />

import { createPinia, defineStore, setActivePinia } from 'pinia';
import { nextTick, ref, watch } from 'vue';

const fetchMock = vi.fn();
const patchMock = vi.fn();
const getRankMock = vi.fn();
const firebaseDbUrl = 'https://firebase-db.test';
const userStoreMock = {
  user: null as { entries: number } | null,
  id: null as string | null,
  token: null as string | null,
  getRank: getRankMock
};

describe('useImageStore', () => {
  const makeStore = async () => {
    const { useImageStore } = await import('../../app/stores/image');
    return useImageStore();
  };

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    // import.meta.env.NUXT_FIREBASE_URL = firebaseDbUrl;
    setActivePinia(createPinia());
    vi.stubGlobal('defineStore', defineStore);
    vi.stubGlobal('ref', ref);
    vi.stubGlobal('watch', watch);
    vi.stubGlobal('$fetch', fetchMock);
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: {
        firebaseDatabase: firebaseDbUrl
      }
    }));
    vi.stubGlobal('useNuxtApp', () => ({
      $api: () => ({
        patch: patchMock
      })
    }));
    vi.stubGlobal('useUserStore', () => userStoreMock);

    userStoreMock.user = null;
    userStoreMock.id = null;
    userStoreMock.token = null;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns early when submitting without imageUrl', async () => {
    const store = await makeStore();

    await store.submitURL();

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('submits imageUrl and sets face boxes', async () => {
    const store = await makeStore();
    const faces = [
      {
        face_token: 'face-1',
        face_rectangle: { top: 1, left: 2, height: 3, width: 4 }
      }
    ];
    fetchMock.mockResolvedValue({ faces });
    store.imageUrl = 'https://img.test/a.jpg';

    await store.submitURL();

    expect(fetchMock).toHaveBeenCalledWith('/api/face/face', {
      method: 'POST',
      body: { imageUrl: 'https://img.test/a.jpg' }
    });
    expect(store.boxes).toEqual(faces);
    expect(patchMock).not.toHaveBeenCalled();
  });

  it('clears boxes when imageUrl changes', async () => {
    const store = await makeStore();
    fetchMock.mockResolvedValue({
      faces: [
        {
          face_token: 'face-1',
          face_rectangle: { top: 1, left: 2, height: 3, width: 4 }
        }
      ]
    });
    store.imageUrl = 'https://img.test/a.jpg';
    await store.submitURL();

    store.imageUrl = 'https://img.test/b.jpg';
    await nextTick();

    expect(store.boxes).toEqual([]);
  });

  it('increases entries and refreshes rank when user context exists', async () => {
    const store = await makeStore();
    fetchMock.mockResolvedValue({
      faces: [
        {
          face_token: 'face-1',
          face_rectangle: { top: 1, left: 2, height: 3, width: 4 }
        }
      ]
    });
    userStoreMock.user = { entries: 1 };
    userStoreMock.id = 'user-1';
    userStoreMock.token = 'token-1';
    patchMock.mockResolvedValue({ data: { entries: 2 } });
    store.imageUrl = 'https://img.test/a.jpg';

    await store.submitURL();

    expect(patchMock).toHaveBeenCalledWith(
      `${firebaseDbUrl}/users/user-1.json`,
      { entries: 2 },
      { params: { auth: 'token-1' } }
    );
    expect(userStoreMock.user.entries).toBe(2);
    expect(getRankMock).toHaveBeenCalled();
  });

  it('logs an error when face request fails', async () => {
    const store = await makeStore();
    const error = {
      statusMessage: 'Bad Request',
      data: {
        message: 'INVALID_IMAGE_URL'
      }
    };
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock.mockRejectedValue(error);
    store.imageUrl = 'https://img.test/a.jpg';

    await store.submitURL();

    expect(errorSpy).toHaveBeenCalledWith('INVALID_IMAGE_URL');
    errorSpy.mockRestore();
  });

  it('logs raw errors when face request fails with a non-H3 error', async () => {
    const store = await makeStore();
    const error = new Error('network failed');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock.mockRejectedValue(error);
    store.imageUrl = 'https://img.test/a.jpg';

    await store.submitURL();

    expect(errorSpy).toHaveBeenCalledWith(error);
    errorSpy.mockRestore();
  });

  it('logs and rethrows entry update errors to submitURL', async () => {
    const store = await makeStore();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock.mockResolvedValue({
      faces: [
        {
          face_token: 'face-1',
          face_rectangle: { top: 1, left: 2, height: 3, width: 4 }
        }
      ]
    });
    userStoreMock.user = { entries: 1 };
    userStoreMock.id = 'user-1';
    userStoreMock.token = 'token-1';
    patchMock.mockRejectedValue({
      isAxiosError: true,
      message: 'entry update failed'
    });
    store.imageUrl = 'https://img.test/a.jpg';

    await store.submitURL();

    expect(errorSpy).toHaveBeenCalledWith('entry update failed');
    expect(userStoreMock.user.entries).toBe(1);
    expect(getRankMock).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
