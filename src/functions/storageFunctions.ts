export const saveAuthTokenInSession = (
  token: string,
  refreshToken: string
): void => {
  window.sessionStorage.setItem('token', token);
  window.sessionStorage.setItem('refreshToken', refreshToken);
};

export const getAuthTokenInSession = () => {
  const token = window.sessionStorage.getItem('token') || '';
  const refreshToken = window.sessionStorage.getItem('refreshToken') || '';

  return { token, refreshToken };
};

export const removeAuthTokenFromSession = (): void => {
  window.sessionStorage.removeItem('token');
  window.sessionStorage.removeItem('refreshToken');
};
