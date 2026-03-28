import { stubServerHandlerGlobals } from '../../setupGlobals';

const loadHandler = async () =>
  (await import('../../../server/api/storage.delete')).default;

describe('server/api/storage.delete', () => {
  const clearMock = vi.fn();
  const storageMock = {
    clear: clearMock
  };

  beforeEach(() => {
    vi.clearAllMocks();
    stubServerHandlerGlobals();
    vi.stubGlobal(
      'useStorage',
      vi.fn(() => storageMock)
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('clears storage', async () => {
    const handler = await loadHandler();
    await handler();

    expect(clearMock).toHaveBeenCalled();
  });
});
