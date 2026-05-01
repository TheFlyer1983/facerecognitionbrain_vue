import type {
  FacePlusPlusErrorResponse,
  ImageResponse
} from '~~/types/image';

const facePlusPlusRateLimitErrors = new Set([
  'CONCURRENCY_LIMIT_EXCEEDED'
]);

const facePlusPlusAuthErrors = new Set([
  'AUTHENTICATION_ERROR',
  'AUTHORIZATION_ERROR'
]);

const facePlusPlusValidationErrors = new Set([
  'INVALID_IMAGE_URL'
]);

function getFacePlusPlusErrorStatus(error: unknown) {
  if (!(error instanceof Error)) {
    return undefined;
  }

  const fetchError = error as Error & {
    status?: number;
    response?: { status?: number };
  };

  return fetchError.status ?? fetchError.response?.status;
}

function getFacePlusPlusErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return 'Face++ request failed';
  }

  const fetchError = error as Error & {
    data?: unknown;
    response?: { _data?: unknown };
  };

  const errorBody = fetchError.data ?? fetchError.response?._data;

  if (isFacePlusPlusErrorResponse(errorBody)) {
    return errorBody.error_message;
  }

  if (
    typeof errorBody === 'object' &&
    errorBody !== null &&
    'error' in errorBody &&
    typeof errorBody.error === 'object' &&
    errorBody.error !== null &&
    'message' in errorBody.error &&
    typeof errorBody.error.message === 'string'
  ) {
    return errorBody.error.message;
  }

  return 'Face++ request failed';
}

function isFacePlusPlusErrorResponse(
  x: unknown
): x is FacePlusPlusErrorResponse {
  return !!(
    typeof x === 'object' &&
    x &&
    'error_message' in x &&
    typeof x.error_message === 'string' &&
    (!('request_id' in x) || typeof x.request_id === 'string') &&
    (!('time_used' in x) || typeof x.time_used === 'number')
  );
}

function isNonEmptyString(x: unknown): x is string {
  return typeof x === 'string' && x.trim().length > 0;
}

function isValidHttpUrl(x: string) {
  try {
    const url = new URL(x);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export default defineEventHandler(async (event) => {
  const { facePlusPlusApiKey, facePlusPlusApiSecret, facePlusPlusUrl } = useRuntimeConfig();

  if (
    !isNonEmptyString(facePlusPlusApiKey) ||
    !isNonEmptyString(facePlusPlusApiSecret) ||
    !isNonEmptyString(facePlusPlusUrl)
  ) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Face++ configuration is missing'
    });
  }

  const body = await readBody(event);

  if (
    typeof body !== 'object' ||
    body === null ||
    !('imageUrl' in body) ||
    !isNonEmptyString(body.imageUrl)
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'A valid imageUrl is required'
    });
  }

  const imageUrl = body.imageUrl;

  if (!isValidHttpUrl(imageUrl)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'imageUrl must be a valid URL'
    });
  }

  const formBody = new URLSearchParams({
    api_key: facePlusPlusApiKey,
    api_secret: facePlusPlusApiSecret,
    image_url: imageUrl
  });

  try {
    const response = await $fetch<ImageResponse>(facePlusPlusUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formBody
    });
    return response;
  } catch (error) {
    const status = getFacePlusPlusErrorStatus(error);
    const message = getFacePlusPlusErrorMessage(error);
    console.error('Face++ request failed', { status, message });

    if (status === 429 || facePlusPlusRateLimitErrors.has(message)) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Too Many Requests',
        message
      });
    }

    if (
      status === 401 ||
      status === 403 ||
      facePlusPlusAuthErrors.has(message)
    ) {
      throw createError({
        statusCode: 502,
        statusMessage: 'Bad Gateway',
        message
      });
    }

    if (status === 400 || facePlusPlusValidationErrors.has(message)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message
      });
    }

    if (typeof status === 'number' && status >= 500) {
      throw createError({
        statusCode: 503,
        statusMessage: 'Service Unavailable',
        message
      });
    }

    throw createError({
      statusCode: 502,
      statusMessage: 'Bad Gateway',
      message
    });
  }
});
