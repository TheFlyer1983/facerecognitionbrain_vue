import { mockNuxtImport } from '@nuxt/test-utils/runtime';

type TokenData = {
  token?: string;
  refreshToken?: string;
};

type UseFetchMockReturn = {
  data: { value: TokenData };
  execute: ReturnType<typeof vi.fn>;
};

const { executeMock, fetchMock, useFetchMock } = vi.hoisted(() => ({
  executeMock: vi.fn(),
  fetchMock: vi.fn(),
  useFetchMock: vi.fn<() => UseFetchMockReturn>(() => ({
    data: {
      value: { token: 'test-token', refreshToken: 'test-refresh-token' }
    },
    execute: vi.fn()
  }))
}));

mockNuxtImport('useFetch', () => useFetchMock);

describe('Given the useTokenStorage composable', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // mock global $fetch
    vi.stubGlobal('$fetch', fetchMock);

    // mock useFetch composable
    useFetchMock.mockReturnValue({
      data: {
        value: { token: 'test-token', refreshToken: 'test-refresh-token' }
      },
      execute: executeMock
    });
  });

  it('should save the auth token and refresh token in session storage', () => {
    const { saveAuthTokenInSession } = useTokenStorage();

    saveAuthTokenInSession('test-token', 'test-refresh-token');

    expect(fetchMock).toHaveBeenCalledWith('/api/storage', {
      method: 'POST',
      body: { token: 'test-token', refreshToken: 'test-refresh-token' }
    });
  });

  it('should get the auth token and refresh token from session storage', async () => {
    const { getAuthTokenInSession } = useTokenStorage();

    const { token, refreshToken } = await getAuthTokenInSession();

    expect(executeMock).toHaveBeenCalled();
    expect(token).toBe('test-token');
    expect(refreshToken).toBe('test-refresh-token');
  });

  it('returns undefined tokens when no data', async () => {
    useFetchMock.mockReturnValue({
      data: {
        value: { token: undefined, refreshToken: undefined }
      },
      execute: executeMock
    });

    const { getAuthTokenInSession } = useTokenStorage();
    const result = await getAuthTokenInSession();

    expect(result).toEqual({ token: undefined, refreshToken: undefined });
  });

  it('deletes tokens from storage', async () => {
    const { removeAuthTokenFromSession } = useTokenStorage();
    await removeAuthTokenFromSession();
    expect(fetchMock).toHaveBeenCalledWith('/api/storage', {
      method: 'DELETE'
    });
  });
});
