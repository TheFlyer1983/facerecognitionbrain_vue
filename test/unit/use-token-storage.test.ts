/// <reference types="vitest/globals" />

const fetchMock = vi.fn();
const useRequestHeadersMock = vi.fn();

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

    saveRefreshTokenInSession('test-refresh-token');

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
});
