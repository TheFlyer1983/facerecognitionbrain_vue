import { mockNuxtImport } from '@nuxt/test-utils/runtime';

const {
  saveRefreshTokenInSessionMock,
  getAuthTokenInSessionMock,
  removeAuthTokenFromSessionMock
} = vi.hoisted(() => ({
  saveRefreshTokenInSessionMock: vi.fn(async () => {}),
  getAuthTokenInSessionMock: vi.fn(async () => ({ token: null, userId: null })),
  removeAuthTokenFromSessionMock: vi.fn(async () => {})
}));

mockNuxtImport('useTokenStorage', () => {
  return () => ({
    saveRefreshTokenInSession: saveRefreshTokenInSessionMock,
    getAuthTokenInSession: getAuthTokenInSessionMock,
    removeAuthTokenFromSession: removeAuthTokenFromSessionMock
  });
});
