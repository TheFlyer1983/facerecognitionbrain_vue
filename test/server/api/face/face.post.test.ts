import { stubServerHandlerGlobals } from '../../../setupGlobals';

const loadHandler = async () =>
  (await import('../../../../server/api/face/face.post')).default;

describe('server/api/face/face.post', () => {
  const fetchMock = vi.fn();
  const facePlusPlusUrl = 'https://face.test/detect';

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    import.meta.env.NUXT_APP_FACE_PLUS_PLUS_URL = facePlusPlusUrl;
    stubServerHandlerGlobals();
    vi.stubGlobal('useRuntimeConfig', () => ({
      facePlusPlusApiKey: 'face-key',
      facePlusPlusApiSecret: 'face-secret',
      facePlusPlusUrl
    }));
    vi.stubGlobal(
      'readBody',
      vi.fn(async () => ({ imageUrl: 'https://img.test/a.jpg' }))
    );
    vi.stubGlobal('$fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns face api response on success', async () => {
    const mockResponse = { faces: [{ face_token: 'abc' }] };
    fetchMock.mockResolvedValue(mockResponse);
    const handler = await loadHandler();

    const result = await handler({} as never);

    expect(fetchMock).toHaveBeenCalledWith(
      facePlusPlusUrl,
      expect.objectContaining({
        method: 'POST',
        query: expect.objectContaining({
          image_url: 'https://img.test/a.jpg'
        })
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it('throws bad request when face api request fails', async () => {
    fetchMock.mockRejectedValue(new Error('request failed'));
    const handler = await loadHandler();

    await expect(handler({} as never)).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid Image URL'
    });
  });
});
