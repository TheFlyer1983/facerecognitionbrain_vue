import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import auth from '~/middleware/auth';

const { navigateToMock } = vi.hoisted(() => ({
  navigateToMock: vi.fn()
}));

mockNuxtImport('navigateTo', () => navigateToMock);

const mockRoute = { fullPath: '/home' } as any;
const mockFromRoute = { fullPath: '/' } as any;

describe('Given the auth middleware', () => {
  const store = useUserStore();

  beforeEach(() => {
    navigateToMock.mockClear();
    store.id = null;
  });

  describe('when the user is authenticated', () => {
    beforeEach(() => {
      store.id = 'user123';
    });

    it('should allow navigation', async () => {
      const result = await auth(mockRoute, mockFromRoute);
      expect(result).toBeUndefined();
      expect(navigateToMock).not.toHaveBeenCalled();
    });
  });

  describe('when the user is not authenticated', () => {
    describe('and reauthentication succeeds', () => {
      it('should not redirect', async () => {
        vi.spyOn(store, 'reauthenticate').mockImplementation(async () => {
          store.id = 'reauthed-user';
        });

        const result = await auth(mockRoute, mockFromRoute);
        expect(store.reauthenticate).toHaveBeenCalled();
        expect(navigateToMock).not.toHaveBeenCalled();
      });
    });

    describe('and reauthentication fails', () => {
      it('should redirect to /login', async () => {
        vi.spyOn(store, 'reauthenticate').mockImplementation(async () => {});

        await auth(mockRoute, mockFromRoute);
        expect(store.reauthenticate).toHaveBeenCalled();
        expect(navigateToMock).toHaveBeenCalledWith('/login');
      });
    });
  });
});
