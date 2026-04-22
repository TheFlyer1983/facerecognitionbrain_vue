import { stubServerHandlerGlobals } from '../../../setupGlobals';

const loadHandler = async () =>
  (await import('../../../../server/api/face/face.post')).default;

describe('server/api/face/face.post', () => {
  const fetchMock = vi.fn();
  const facePlusPlusUrl = 'https://face.test/detect';

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
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
        headers: expect.objectContaining({
          'Content-Type': 'application/x-www-form-urlencoded'
        }),
        body: new URLSearchParams({
          api_key: 'face-key',
          api_secret: 'face-secret',
          image_url: 'https://img.test/a.jpg'
        })
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it('returns bad request when imageUrl is missing', async () => {
    vi.stubGlobal('readBody', vi.fn(async () => ({ })));
    const handler = await loadHandler();

    await expect(handler({} as never)).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'A valid imageUrl is required'
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns bad request when imageUrl is not a valid URL', async () => {
    vi.stubGlobal('readBody', vi.fn(async () => ({ imageUrl: 'not-a-url' })));
    const handler = await loadHandler();

    await expect(handler({} as never)).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'imageUrl must be a valid URL'
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns internal server error when Face++ config is missing', async () => {
    vi.stubGlobal('useRuntimeConfig', () => ({
      facePlusPlusApiKey: '',
      facePlusPlusApiSecret: 'face-secret',
      facePlusPlusUrl
    }));
    const handler = await loadHandler();

    await expect(handler({} as never)).rejects.toMatchObject({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Face++ configuration is missing'
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns bad request when Face++ rejects an invalid image URL', async () => {
    const error = Object.assign(new Error('request failed'), {
      status: 400,
      data: {
        request_id: 'request-1',
        time_used: 86,
        error_message: 'INVALID_IMAGE_URL'
      }
    });
    fetchMock.mockRejectedValue(error);
    const handler = await loadHandler();

    await expect(handler({} as never)).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'INVALID_IMAGE_URL'
    });
  });

  it('returns too many requests when Face++ rate limits', async () => {
    const error = Object.assign(new Error('rate limited'), {
      status: 429,
      data: {
        request_id: 'request-2',
        time_used: 42,
        error_message: 'CONCURRENCY_LIMIT_EXCEEDED'
      }
    });
    fetchMock.mockRejectedValue(error);
    const handler = await loadHandler();

    await expect(handler({} as never)).rejects.toMatchObject({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      message: 'CONCURRENCY_LIMIT_EXCEEDED'
    });
  });

  it('maps Face++ auth failures to bad gateway', async () => {
    const error = Object.assign(new Error('forbidden'), {
      status: 403,
      data: {
        request_id: 'request-3',
        time_used: 12,
        error_message: 'AUTHORIZATION_ERROR'
      }
    });
    fetchMock.mockRejectedValue(error);
    const handler = await loadHandler();

    await expect(handler({} as never)).rejects.toMatchObject({
      statusCode: 502,
      statusMessage: 'Bad Gateway',
      message: 'AUTHORIZATION_ERROR'
    });
  });

  it('maps Face++ 401 authentication errors to bad gateway', async () => {
    const error = Object.assign(new Error('unauthorized'), {
      status: 401,
      data: {
        error_message: 'AUTHENTICATION_ERROR'
      }
    });
    fetchMock.mockRejectedValue(error);
    const handler = await loadHandler();

    await expect(handler({} as never)).rejects.toMatchObject({
      statusCode: 502,
      statusMessage: 'Bad Gateway',
      message: 'AUTHENTICATION_ERROR'
    });
  });

  it('maps documented Face++ auth messages to bad gateway even without a status', async () => {
    const error = Object.assign(new Error('upstream auth failed'), {
      data: {
        error_message: 'AUTHORIZATION_ERROR'
      }
    });
    fetchMock.mockRejectedValue(error);
    const handler = await loadHandler();

    await expect(handler({} as never)).rejects.toMatchObject({
      statusCode: 502,
      statusMessage: 'Bad Gateway',
      message: 'AUTHORIZATION_ERROR'
    });
  });

  it('reads nested upstream error messages from response data', async () => {
    const error = Object.assign(new Error('request failed'), {
      response: {
        status: 400,
        _data: {
          error: {
            message: 'NESTED_FACE_ERROR'
          }
        }
      }
    });
    fetchMock.mockRejectedValue(error);
    const handler = await loadHandler();

    await expect(handler({} as never)).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'NESTED_FACE_ERROR'
    });
  });

  it('maps Face++ upstream 5xx responses to service unavailable', async () => {
    const error = Object.assign(new Error('upstream down'), {
      status: 500,
      data: {
        request_id: 'request-4',
        time_used: 10,
        error_message: 'Internal server error'
      }
    });
    fetchMock.mockRejectedValue(error);
    const handler = await loadHandler();

    await expect(handler({} as never)).rejects.toMatchObject({
      statusCode: 503,
      statusMessage: 'Service Unavailable',
      message: 'Internal server error'
    });
  });

  it('falls back to bad gateway for unknown upstream failures', async () => {
    const error = Object.assign(new Error('unexpected upstream failure'), {
      status: 418,
      data: {
        error_message: 'SOMETHING_UNEXPECTED'
      }
    });
    fetchMock.mockRejectedValue(error);
    const handler = await loadHandler();

    await expect(handler({} as never)).rejects.toMatchObject({
      statusCode: 502,
      statusMessage: 'Bad Gateway',
      message: 'SOMETHING_UNEXPECTED'
    });
  });

  it('sanitizes generic upstream errors before returning them to clients', async () => {
    const error = new Error(
      'fetch failed for https://face.test/detect?api_secret=face-secret'
    );
    fetchMock.mockRejectedValue(error);
    const handler = await loadHandler();

    await expect(handler({} as never)).rejects.toMatchObject({
      statusCode: 502,
      statusMessage: 'Bad Gateway',
      message: 'Face++ request failed'
    });
  });
});
