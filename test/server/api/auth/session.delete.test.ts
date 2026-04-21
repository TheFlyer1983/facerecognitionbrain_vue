import { stubServerHandlerGlobals } from '../../../setupGlobals';

const loadHandler = async () =>
  (await import('../../../../server/api/auth/session.delete')).default;

describe('server/api/auth/session.delete', () => {
  const deleteCookieMock = vi.fn();

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    stubServerHandlerGlobals();
    vi.stubGlobal('deleteCookie', deleteCookieMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('clears the refresh token cookie', async () => {
    const event = {} as never;
    const handler = await loadHandler();
    const result = await handler(event);

    expect(deleteCookieMock).toHaveBeenCalledWith(event, 'refreshToken');
    expect(result).toEqual({
      message: 'Refresh token deleted successfully',
      statusCode: 200,
      statusMessage: 'OK'
    });
  });
});
