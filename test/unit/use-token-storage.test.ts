/// <reference types="vitest/globals" />

const fetchMock = vi.fn();
const useRequestHeadersMock = vi.fn();
const eventFetchMock = vi.fn();
const eventMock = {
  $fetch: eventFetchMock
} as never;

describe('useTokenStorage', () => {
  const loadComposable = async () =>
    (await import('../../app/composables/useTokenStorage')).useTokenStorage;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.stubGlobal('$fetch', fetchMock);
    vi.stubGlobal('useRequestHeaders', useRequestHeadersMock);
    useRequestHeadersMock.mockReturnValue({ cookie: 'refreshToken=abc' });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('saves the refresh token via the auth session endpoint', async () => {
    const useTokenStorage = await loadComposable();
    const { saveRefreshTokenInSession } = useTokenStorage();

    await saveRefreshTokenInSession('test-refresh-token');

    expect(fetchMock).toHaveBeenCalledWith('/api/auth/session', {
      method: 'POST',
      body: { refreshToken: 'test-refresh-token' },
      credentials: 'include'
    });
  });

  it('gets the current auth session from the auth session endpoint', async () => {
    fetchMock.mockResolvedValueOnce({ token: 'test-token', userId: 'user-1' });

    const useTokenStorage = await loadComposable();
    const { getAuthTokenInSession } = useTokenStorage();
    const result = await getAuthTokenInSession();

    expect(result).toEqual({ token: 'test-token', userId: 'user-1' });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/auth/session',
      expect.objectContaining({
        credentials: 'include'
      })
    );
  });

  it('uses the request event fetcher during SSR', async () => {
    eventFetchMock.mockResolvedValueOnce({ token: 'test-token', userId: 'user-1' });

    const useTokenStorage = await loadComposable();
    const { getAuthTokenInSession } = useTokenStorage();
    const result = await getAuthTokenInSession(eventMock);

    expect(result).toEqual({ token: 'test-token', userId: 'user-1' });
    expect(eventFetchMock).toHaveBeenCalledWith('/api/auth/session', {
      credentials: 'include',
      headers: undefined
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('includes credentials when requesting the current auth session', async () => {
    fetchMock.mockResolvedValueOnce({ token: 'test-token', userId: 'user-1' });

    const useTokenStorage = await loadComposable();
    const { getAuthTokenInSession } = useTokenStorage();
    await getAuthTokenInSession();

    const options = fetchMock.mock.calls[0]?.[1];
    expect(options?.credentials).toBe('include');
  });

  it('deletes the auth session via the auth session endpoint', async () => {
    const useTokenStorage = await loadComposable();
    const { removeAuthTokenFromSession } = useTokenStorage();
    await removeAuthTokenFromSession();

    expect(fetchMock).toHaveBeenCalledWith('/api/auth/session', {
      method: 'DELETE',
      credentials: 'include'
    });
  });

  it('deletes the auth session with the request event fetcher during SSR', async () => {
    const useTokenStorage = await loadComposable();
    const { removeAuthTokenFromSession } = useTokenStorage();
    await removeAuthTokenFromSession(eventMock);

    expect(eventFetchMock).toHaveBeenCalledWith('/api/auth/session', {
      method: 'DELETE',
      credentials: 'include'
    });
  });
});
