import { stubServerHandlerGlobals } from '../../../setupGlobals';

const loadHandler = async () =>
  (await import('../../../../server/api/auth/session.post')).default;

describe('server/api/auth/session.post', () => {
  const readBodyMock = vi.fn();
  const setCookieMock = vi.fn();

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    stubServerHandlerGlobals();
    vi.stubGlobal('readBody', readBodyMock);
    vi.stubGlobal('setCookie', setCookieMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('stores the refresh token in an httpOnly cookie', async () => {
    const event = {} as never;
    readBodyMock.mockResolvedValueOnce({ refreshToken: 'refresh-1' });

    const handler = await loadHandler();
    const result = await handler(event);

    expect(setCookieMock).toHaveBeenCalledWith(
      event,
      'refreshToken',
      'refresh-1',
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/'
      })
    );
    expect(result).toEqual({ message: 'Refresh token set successfully' });
  });

  it('throws a bad request error when refreshToken is missing', async () => {
    readBodyMock.mockResolvedValueOnce({});

    const handler = await loadHandler();

    await expect(handler({} as never)).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Refresh token is required'
    });
  });
});
