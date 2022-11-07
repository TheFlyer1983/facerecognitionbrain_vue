import {
  saveAuthTokenInSession,
  getAuthTokenInSession,
  removeAuthTokenFromSession
} from './storageFunctions';

const mockedToken = '123ABC123ABC';
const mockedRefreshToken = 'refreshToken';

const sessionStorageMock = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
});

describe('when the `saveAuthTokenInSession` function is called', () => {
  beforeEach(() => {
    window.sessionStorage.clear();

    vi.resetAllMocks();

    saveAuthTokenInSession(mockedToken, mockedRefreshToken);
  });

  it('should save info into session storage', () => {
    expect(window.sessionStorage.getItem('token')).toStrictEqual(mockedToken);
    expect(window.sessionStorage.getItem('refreshToken')).toStrictEqual(
      mockedRefreshToken
    );
  });
});

describe('when the `getAuthTokenInSession` function is called', () => {
  let result: ReturnType<typeof getAuthTokenInSession>;
  beforeEach(() => {
    window.sessionStorage.clear();

    vi.resetAllMocks();

    saveAuthTokenInSession(mockedToken, mockedRefreshToken);

    result = getAuthTokenInSession();
  });

  it('should get info from session storage', () => {
    expect(result.token).toStrictEqual(mockedToken);
    expect(result.refreshToken).toStrictEqual(mockedRefreshToken);
  });

  describe('when session values are blank', () => {
    let result: ReturnType<typeof getAuthTokenInSession>;

    beforeEach(() => {
      window.sessionStorage.clear();

      vi.resetAllMocks();

      result = getAuthTokenInSession();
    });

    it('should return blank strings', () => {
      expect(result.token).toStrictEqual('');
      expect(result.refreshToken).toStrictEqual('');
    });
  });
});

describe('when the `removeAuthTokenFromSession` function is called', () => {
  beforeEach(() => {
    window.sessionStorage.clear();

    vi.resetAllMocks();

    saveAuthTokenInSession(mockedToken, mockedRefreshToken);

    removeAuthTokenFromSession();
  });

  it('should remove the token from session storage', () => {
    expect(window.sessionStorage.getItem('token')).toBeFalsy();
    expect(window.sessionStorage.getItem('refreshToken')).toBeFalsy();
  });
});
