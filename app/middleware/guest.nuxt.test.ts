import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import guest from '~/middleware/guest';

const { navigateToMock } = vi.hoisted(() => ({
  navigateToMock: vi.fn()
}));

mockNuxtImport('navigateTo', () => navigateToMock);

type GuestRouteArg = Parameters<typeof guest>[0];

const mockRoute = { fullPath: '/login' } as GuestRouteArg;
const mockFromRoute = { fullPath: '/' } as GuestRouteArg;

describe('Given the guest middleware', () => {
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

  describe('when the user is already authenticated', () => {
    it('should redirect to / without reauthenticating', async () => {
      store.id = 'user123';
      const reauthenticateSpy = vi.spyOn(store, 'reauthenticate');

      await guest(mockRoute, mockFromRoute);

      expect(reauthenticateSpy).not.toHaveBeenCalled();
      expect(navigateToMock).toHaveBeenCalledWith('/');
    });
  });

  describe('when the user is not authenticated', () => {
    describe('and reauthentication succeeds', () => {
      it('should redirect to /', async () => {
        vi.spyOn(store, 'reauthenticate').mockImplementation(async () => {
          store.id = 'reauthed-user';
        });

        await guest(mockRoute, mockFromRoute);

        expect(store.reauthenticate).toHaveBeenCalled();
        expect(navigateToMock).toHaveBeenCalledWith('/');
      });
    });

    describe('and reauthentication fails', () => {
      it('should allow navigation to continue', async () => {
        vi.spyOn(store, 'reauthenticate').mockImplementation(async () => {});

        const result = await guest(mockRoute, mockFromRoute);

        expect(result).toBeUndefined();
        expect(store.reauthenticate).toHaveBeenCalled();
        expect(navigateToMock).not.toHaveBeenCalled();
      });
    });
  });
});
