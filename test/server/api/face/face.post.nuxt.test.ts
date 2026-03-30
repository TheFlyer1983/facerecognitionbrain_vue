import { facePlusPlus } from '../../../../constants/api';
import { stubServerHandlerGlobals } from '../../../setupGlobals';

const loadHandler = async () =>
  (await import('../../../../server/api/face/face.post')).default;

describe('server/api/face/face.post', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    stubServerHandlerGlobals();
    vi.stubGlobal(
      'readBody',
      vi.fn(async () => ({ imageUrl: 'https://img.test/a.jpg' }))
    );
    vi.stubGlobal('$fetch', fetchMock);
  });

  it('returns face api response on success', async () => {
    const mockResponse = { faces: [{ face_token: 'abc' }] };
    fetchMock.mockResolvedValue(mockResponse);
    const handler = await loadHandler();

    const result = await handler({} as never);

    expect(fetchMock).toHaveBeenCalledWith(
      facePlusPlus,
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
