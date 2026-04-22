import type { H3Event } from 'h3';

export const useTokenStorage = () => {
  async function saveRefreshTokenInSession(
    refreshToken: string,
    event?: H3Event
  ) {
    const fetcher = event?.$fetch ?? $fetch;

    await fetcher('/api/auth/session', {
      method: 'POST',
      body: {
        refreshToken
      },
      credentials: 'include'
    });
  }

  async function getAuthTokenInSession(event?: H3Event) {
    const fetcher = event?.$fetch ?? $fetch;
    const headers =
      import.meta.server && !event ? useRequestHeaders(['cookie']) : undefined;

    return await fetcher('/api/auth/session', {
      credentials: 'include',
      headers
    });
  }

  async function removeAuthTokenFromSession(event?: H3Event) {
    const fetcher = event?.$fetch ?? $fetch;

    await fetcher('/api/auth/session', {
      method: 'DELETE',
      credentials: 'include'
    });
  }

  return {
    saveRefreshTokenInSession,
    getAuthTokenInSession,
    removeAuthTokenFromSession
  };
};
