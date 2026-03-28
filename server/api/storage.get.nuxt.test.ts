const loadHandler = async () => (await import('./storage.get')).default;

describe('server/api/storage.get', () => {
  const getItemMock = vi.fn();
  const storageMock = {
    getItem: getItemMock
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('defineEventHandler', (fn: unknown) => fn);
    vi.stubGlobal(
      'useStorage',
      vi.fn(() => storageMock)
    );
  });

  it('returns token and refresh token', async () => {
    getItemMock.mockImplementation(async (key: string) => {
      if (key === 'token') return 'token-1';
      if (key === 'refresh-token') return 'refresh-1';
      return null;
    });

    const handler = await loadHandler();
    const result = await handler();

    expect(result).toEqual({ token: 'token-1', refreshToken: 'refresh-1' });
  });
});
