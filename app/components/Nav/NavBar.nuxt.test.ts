import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime';
import NavBar from './NavBar.vue';
import { createTestingPinia } from '@pinia/testing';
import { useUserStore } from '~/stores/user';

describe('Given the NavBar component', async () => {
  const pinia = createTestingPinia({
    createSpy: vi.fn,
    stubActions: true,
    initialState: {
      UserStore: {
        isSignedIn: true
      }
    }
  });

  const { navigateToMock } = vi.hoisted(() => ({
    navigateToMock: vi.fn()
  }));

  mockNuxtImport('navigateTo', () => navigateToMock);

  const mockUserStore = useUserStore(pinia);
  const component = await mountSuspended(NavBar, {
    route: '/',
    global: { plugins: [pinia] }
  });

  describe('when the component is rendered', () => {
    it('mounts the NavBar component', () => {
      expect(component.exists()).toBe(true);
    });

    it('matches the snapshot', () => {
      expect(component.element).toMatchSnapshot();
    });
  });

  describe('when the user is logged in', () => {
    it('should render the ProfileIcon', () => {
      expect(component.findComponent({ name: 'ProfileIcon' }).exists()).toBe(
        true
      );
    });

    describe('and the profile icon is clicked', () => {
      beforeEach(() => {
        component.findComponent({ name: 'ProfileIcon' }).trigger('click');
      });

      it('should render the ProfileModal', () => {
        expect(component.findComponent({ name: 'ProfileIcon' }).exists()).toBe(
          true
        );
      });

      describe('and the sign out button is clicked', () => {
        beforeEach(() => {
          component.findComponent({ name: 'ProfileIcon' }).vm.$emit('signout');
        });

        it('sign the user out', () => {
          expect(mockUserStore.signout).toHaveBeenCalledOnce();
        });

        it('navigates to the login page', () => {
          expect(navigateToMock).toHaveBeenCalledWith('/login');
        });
      });
    });
  });

  describe('when the user is logged out', () => {
    beforeEach(() => {
      mockUserStore.isSignedIn = false;
    });

    describe('it should render the SignIn link', () => {
      it('renders the SignIn link', () => {
        expect(component.find('[data-test="signin"]').exists()).toBe(true);
      });

      describe('and the sign in link is clicked', () => {
        beforeEach(() => {
          component.find('[data-test="signin"]').trigger('click');
        });
        
        it('navigates to the login page', () => {
          expect(navigateToMock).toHaveBeenCalledWith('/login');
        });
      });
    });

    describe('it should render the Register link', () => {
      it('renders the Register link', () => {
        expect(component.find('[data-test="register"]').exists()).toBe(true);
      });

      describe('and the register link is clicked', () => {
        beforeEach(() => {
          component.find('[data-test="register"]').trigger('click');
        });

        it('navigates to the register page', () => {
          expect(navigateToMock).toHaveBeenCalledWith('/register');
        });
      });
    });
  });
});
