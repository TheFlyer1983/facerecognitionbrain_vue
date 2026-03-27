import {
  saveAuthTokenInSession,
  getAuthTokenInSession,
  removeAuthTokenFromSession
} from './storageFunctions';

describe('storageFunctions', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('saves auth and refresh tokens in session storage', () => {
    saveAuthTokenInSession('token-1', 'refresh-1');

    expect(window.sessionStorage.getItem('token')).toBe('token-1');
    expect(window.sessionStorage.getItem('refreshToken')).toBe('refresh-1');
  });

  it('gets auth and refresh tokens from session storage', () => {
    window.sessionStorage.setItem('token', 'token-1');
    window.sessionStorage.setItem('refreshToken', 'refresh-1');

    const result = getAuthTokenInSession();

    expect(result).toEqual({ token: 'token-1', refreshToken: 'refresh-1' });
  });

  it('returns empty strings when tokens do not exist', () => {
    const result = getAuthTokenInSession();

    expect(result).toEqual({ token: '', refreshToken: '' });
  });

  it('removes auth and refresh tokens from session storage', () => {
    window.sessionStorage.setItem('token', 'token-1');
    window.sessionStorage.setItem('refreshToken', 'refresh-1');

    removeAuthTokenFromSession();

    expect(window.sessionStorage.getItem('token')).toBeNull();
    expect(window.sessionStorage.getItem('refreshToken')).toBeNull();
  });
});
