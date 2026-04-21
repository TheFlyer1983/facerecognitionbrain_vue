import { setRefreshToken } from '~~/server/utils/session';
import type { ReAuthResponse } from '~~/types';

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
  } catch {
    return {
      token: null,
      userId: null
    };
  }
});
