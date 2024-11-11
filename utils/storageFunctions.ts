export function saveAuthTokenInSession(token: string, refreshToken: string) {
  window.sessionStorage.setItem('token', token);
  window.sessionStorage.setItem('refreshToken', refreshToken);
}

export function getAuthTokenInSession() {
  const token = window.sessionStorage.getItem('token') || '';
  const refreshToken = window.sessionStorage.getItem('refreshToken') || '';

  return { token, refreshToken };
}

export function removeAuthTokenFromSession() {
  window.sessionStorage.removeItem('token');
  window.sessionStorage.removeItem('refreshToken');
};
