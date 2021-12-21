export const saveAuthTokenInSession = (token: string): void => {
  window.sessionStorage.setItem('token', token);
};

export const getAuthTokenInSession = () => {
  return window.sessionStorage.getItem('token');
}