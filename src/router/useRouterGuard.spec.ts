import { describe, it, expect, vi, beforeEach } from 'vitest';

import useRouterGuards from './useRouterGuards';
import { getAuthTokenInSession } from '@/functions/storageFunctions';
import { Routes } from './routes';

vi.mock('@/functions/storageFunctions');

const nextCallback = vi.fn();
const mockedGetAuthTokenInSession = vi.mocked(getAuthTokenInSession, true);

describe('Given the `useRouterGuard` hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when it is called', () => {
    let result: ReturnType<typeof useRouterGuards>;

    beforeEach(() => {
      result = useRouterGuards();
    });

    describe('when an authentication token is available', () => {
      const mockedToken = '123ABC123ABC';
      const mockedRefreshToken = 'refreshToken';

      beforeEach(() => {
        mockedGetAuthTokenInSession.mockReturnValue({
          token: mockedToken,
          refreshToken: mockedRefreshToken
        });

        result.authenticated(nextCallback);
      });

      it('should call the next callback correctly', () => {
        expect(nextCallback).toHaveBeenCalledWith();
      });
    });

    describe('when an authentication token is not available', () => {
      beforeEach(() => {
        mockedGetAuthTokenInSession.mockReturnValue({
          token: '',
          refreshToken: 'refreshToken'
        });

        result.authenticated(nextCallback);
      });

      it('should call the next callback correctly', () => {
        expect(nextCallback).toHaveBeenCalledWith({ name: Routes.Login });
      });
    });
  });
});
