import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import auth from '~/middleware/auth';

const { navigateToMock } = vi.hoisted(() => ({
  navigateToMock: vi.fn()
}));

mockNuxtImport('navigateTo', () => navigateToMock);

type AuthRouteArg = Parameters<typeof auth>[0];

const mockRoute = { fullPath: '/' } as AuthRouteArg;
const mockFromRoute = { fullPath: '/' } as AuthRouteArg;

describe('Given the auth middleware', () => {
  let store: ReturnType<typeof useUserStore>;

  beforeEach(() => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false
    });
    setActivePinia(pinia);
    store = useUserStore();
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

        await auth(mockRoute, mockFromRoute);
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
