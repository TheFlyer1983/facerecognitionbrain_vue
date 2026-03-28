export {};

const loadHandler = async () =>
  (await import('../../../server/api/storage.post')).default;

describe('server/api/storage.post', () => {
  const setItemMock = vi.fn();
  const storageMock = {
    setItem: setItemMock
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('defineEventHandler', (fn: unknown) => fn);
    vi.stubGlobal(
      'useStorage',
      vi.fn(() => storageMock)
    );
    vi.stubGlobal(
      'readBody',
      vi.fn(async () => ({ token: 'token-1', refreshToken: 'refresh-1' }))
    );
  });

  it('stores token and refresh token', async () => {
    const handler = await loadHandler();
    await handler({} as never);

    expect(setItemMock).toHaveBeenCalledWith('token', 'token-1');
    expect(setItemMock).toHaveBeenCalledWith('refresh-token', 'refresh-1');
  });
});
