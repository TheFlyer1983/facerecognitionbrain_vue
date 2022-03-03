import { describe, it, expect, vi, beforeEach } from 'vitest';
import { storeKey } from 'vuex';

import {
  saveAuthTokenInSession,
  getAuthTokenInSession,
  removeAuthTokenFromSession
} from './storageFunctions';

const mockedToken = '123ABC123ABC';

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

    saveAuthTokenInSession(mockedToken);
  });

  it('should save info into session storage', () => {
    expect(window.sessionStorage.getItem('token')).toStrictEqual(mockedToken);
  });
});

describe('when the `saveAuthTokenInSession` function is called', () => {
  beforeEach(() => {
    window.sessionStorage.clear();

    vi.resetAllMocks();

    saveAuthTokenInSession(mockedToken);

    getAuthTokenInSession();
  });

  it('should save info into session storage', () => {
    expect(window.sessionStorage.getItem('token')).toStrictEqual(mockedToken);
  });
});

describe('when the `removeAuthTokenFromSession` function is called', () => {
  beforeEach(() => {
    window.sessionStorage.clear();

    vi.resetAllMocks();

    saveAuthTokenInSession(mockedToken);

    removeAuthTokenFromSession();
  });

  it('should remove the token from session storage', () => {
    expect(window.sessionStorage.getItem('token')).toBeFalsy();
  });
});
