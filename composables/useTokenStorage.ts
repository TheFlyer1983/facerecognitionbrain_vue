export const useTokenStorage = () => {
  const { data, execute } = useFetch('/api/storage');

  function saveAuthTokenInSession(token: string, refreshToken: string) {
    $fetch('/api/storage', {
      method: 'POST',
      body: {
        token,
        refreshToken
      }
    });
  }

  async function getAuthTokenInSession() {
    await execute();
    const token = data.value?.token;
    const refreshToken = data.value?.refreshToken;

    return { token, refreshToken };
  }

  async function removeAuthTokenFromSession() {
    $fetch('/api/storage', {
      method: 'DELETE'
    });
  }

  return {
    saveAuthTokenInSession,
    getAuthTokenInSession,
    removeAuthTokenFromSession
  };
};
