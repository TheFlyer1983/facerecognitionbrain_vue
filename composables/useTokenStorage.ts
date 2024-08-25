export const useTokenStorage = () => {
  function saveAuthTokenInSession(token: string, refreshToken: string) {
    window.sessionStorage.setItem('token', token);
    window.sessionStorage.setItem('refreshToken', refreshToken);
  }

  return { saveAuthTokenInSession };
};
