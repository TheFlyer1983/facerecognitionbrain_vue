const loadHandler = async () =>
  (await import('../../../server/api/storage.delete')).default;

describe('server/api/storage.delete', () => {
  const clearMock = vi.fn();
  const storageMock = {
    clear: clearMock
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('defineEventHandler', (fn: unknown) => fn);
    vi.stubGlobal(
      'useStorage',
      vi.fn(() => storageMock)
    );
  });

  it('clears storage', async () => {
    const handler = await loadHandler();
    await handler();

    expect(clearMock).toHaveBeenCalled();
  });
});
