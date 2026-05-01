import { setRefreshToken } from '~~/server/utils/session';
import type { FirebaseReauthError, ReAuthResponse } from '~~/types';

const firebaseAuthErrors = new Set([
  'TOKEN_EXPIRED',
  'INVALID_REFRESH_TOKEN',
  'MISSING_REFRESH_TOKEN',
  'USER_DISABLED',
  'USER_NOT_FOUND',
  'INVALID_GRANT'
]);

function isFirebaseReauthError(
  x: unknown
): x is FirebaseReauthError {
  return !!(
    typeof x === 'object' &&
    x &&
    'error' in x &&
    typeof x.error === 'object' &&
    x.error &&
    'code' in x.error &&
    typeof x.error.code === 'number' &&
    'message' in x.error &&
    typeof x.error.message === 'string' &&
    'status' in x.error &&
    typeof x.error.status === 'string'
  );
}

function shouldClearRefreshCookie(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const fetchError = error as Error & {
    data?: unknown;
    response?: { _data?: unknown };
  };

  const errorBody = fetchError.data ?? fetchError.response?._data;

  if (isFirebaseReauthError(errorBody)) {
    return firebaseAuthErrors.has(errorBody.error.message);
  }

  return false;
}

export default defineEventHandler(async (event) => {
  const {
    public: { firebaseApiKey, firebaseReauth }
  } = useRuntimeConfig();

  try {
    const refreshToken = getCookie(event, 'refreshToken');

    if (!refreshToken) {
      return {
        token: null,
        userId: null
      };
    }

    const response = await $fetch<ReAuthResponse>(firebaseReauth, {
      method: 'POST',
      body: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      },
      query: {
        key: firebaseApiKey
      }
    });

    if (response.refresh_token && response.refresh_token !== refreshToken) {
      setRefreshToken(event, response.refresh_token);
    }

    return {
      token: response.id_token,
      userId: response.user_id
    };
  } catch (error) {
    if (shouldClearRefreshCookie(error)) {
      deleteCookie(event, 'refreshToken');

      return {
        token: null,
        userId: null
      };
    }

    throw error;
  }
});
