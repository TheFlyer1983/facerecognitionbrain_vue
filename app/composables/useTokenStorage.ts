export const useTokenStorage = () => {
  async function saveRefreshTokenInSession(refreshToken: string) {
    await $fetch('/api/auth/session', {
      method: 'POST',
      body: {
        refreshToken
      },
      credentials: 'include'
    });
  }

  async function getAuthTokenInSession() {
    const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined;

    return await $fetch('/api/auth/session', {
      credentials: 'include',
      headers
    });
  }

  async function removeAuthTokenFromSession() {
    await $fetch('/api/auth/session', {
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
