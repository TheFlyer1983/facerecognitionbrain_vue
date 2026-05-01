import { stubServerHandlerGlobals } from '../../../setupGlobals';

const firebaseApiKey = 'firebase-api-key';
const firebaseReauthUrl = 'https://securetoken.test/v1/token';

const loadHandler = async () =>
  (await import('../../../../server/api/auth/session.get')).default;

describe('server/api/auth/session.get', () => {
  const getCookieMock = vi.fn();
  const fetchMock = vi.fn();
  const setCookieMock = vi.fn();
  const deleteCookieMock = vi.fn();

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    import.meta.env.NUXT_FIREBASE_REAUTH_URL = firebaseReauthUrl;
    stubServerHandlerGlobals();
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: {
        firebaseApiKey,
        firebaseReauth: firebaseReauthUrl
      }
    }));
    vi.stubGlobal('getCookie', getCookieMock);
    vi.stubGlobal('$fetch', fetchMock);
    vi.stubGlobal('setCookie', setCookieMock);
    vi.stubGlobal('deleteCookie', deleteCookieMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns a null session when there is no refresh token cookie', async () => {
    getCookieMock.mockReturnValueOnce(undefined);

    const handler = await loadHandler();
    const result = await handler({} as never);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result).toEqual({ token: null, userId: null });
  });

  it('refreshes the session and rotates the refresh token cookie', async () => {
    const event = {} as never;
    getCookieMock.mockReturnValueOnce('refresh-1');
    fetchMock.mockResolvedValueOnce({
      id_token: 'token-1',
      user_id: 'user-1',
      refresh_token: 'refresh-2'
    });

    const handler = await loadHandler();
    const result = await handler(event);

    expect(fetchMock).toHaveBeenCalledWith(firebaseReauthUrl, {
      method: 'POST',
      body: {
        grant_type: 'refresh_token',
        refresh_token: 'refresh-1'
      },
      query: {
        key: firebaseApiKey
      }
    });
    expect(setCookieMock).toHaveBeenCalledWith(
      event,
      'refreshToken',
      'refresh-2',
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/'
      })
    );
    expect(result).toEqual({ token: 'token-1', userId: 'user-1' });
  });

  it('clears the refresh token when Firebase rejects it with an auth error', async () => {
    const event = {} as never;
    getCookieMock.mockReturnValueOnce('refresh-1');
    const error = Object.assign(new Error('refresh failed'), {
      data: {
        error: {
          code: 400,
          message: 'MISSING_REFRESH_TOKEN',
          status: 'INVALID_ARGUMENT'
        }
      }
    });
    fetchMock.mockRejectedValueOnce(error);

    const handler = await loadHandler();
    const result = await handler(event);

    expect(deleteCookieMock).toHaveBeenCalledWith(event, 'refreshToken');
    expect(result).toEqual({ token: null, userId: null });
  });

  it('rethrows non-auth infrastructure failures', async () => {
    getCookieMock.mockReturnValueOnce('refresh-1');
    fetchMock.mockRejectedValueOnce(new Error('network down'));

    const handler = await loadHandler();

    await expect(handler({} as never)).rejects.toThrow('network down');
    expect(deleteCookieMock).not.toHaveBeenCalled();
  });
});
