import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime';
import NavBar from './NavBar.vue';
import { createTestingPinia } from '@pinia/testing';
import { useUserStore } from '~/stores/user';

const { navigateToMock } = vi.hoisted(() => ({
  navigateToMock: vi.fn()
}));

mockNuxtImport('navigateTo', () => navigateToMock);

describe('Given the NavBar component', () => {
  const render = async (isSignedIn = true) => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: true,
      initialState: {
        UserStore: {
          isSignedIn
        }
      }
    });

    const component = await mountSuspended(NavBar, {
      route: '/',
      global: { plugins: [pinia] }
    });

    return { component, store: useUserStore(pinia) };
  };

  beforeEach(() => {
    navigateToMock.mockClear();
  });

  describe('when the component is rendered', () => {
    it('mounts the NavBar component', async () => {
      const { component } = await render();
      expect(component.exists()).toBe(true);
    });

    it('matches the snapshot', async () => {
      const { component } = await render();
      expect(component.element).toMatchSnapshot();
    });
  });

  describe('when the user is logged in', () => {
    it('should render the ProfileIcon', async () => {
      const { component } = await render();
      expect(component.findComponent({ name: 'ProfileIcon' }).exists()).toBe(
        true
      );
    });

    describe('and the profile icon is clicked', () => {
      it('should render the ProfileModal', async () => {
        const { component } = await render();
        component.findComponent({ name: 'ProfileIcon' }).trigger('click');
        expect(component.findComponent({ name: 'ProfileIcon' }).exists()).toBe(
          true
        );
      });

      it('signs the user out and navigates to login', async () => {
        const { component, store } = await render();
        component.findComponent({ name: 'ProfileIcon' }).vm.$emit('signout');
        expect(store.signout).toHaveBeenCalledOnce();
        expect(navigateToMock).toHaveBeenCalledWith('/login');
      });
    });
  });

  describe('when the user is logged out', () => {
    describe('it should render the SignIn link', () => {
      it('renders the SignIn link', async () => {
        const { component } = await render(false);
        expect(component.find('[data-test="signin"]').exists()).toBe(true);
      });

      it('navigates to the login page when sign in link is clicked', async () => {
        const { component } = await render(false);
          component.find('[data-test="signin"]').trigger('click');
        expect(navigateToMock).toHaveBeenCalledWith('/login');
      });
    });

    describe('it should render the Register link', () => {
      it('renders the Register link', async () => {
        const { component } = await render(false);
        expect(component.find('[data-test="register"]').exists()).toBe(true);
      });

      it('navigates to the register page when register link is clicked', async () => {
        const { component } = await render(false);
          component.find('[data-test="register"]').trigger('click');
        expect(navigateToMock).toHaveBeenCalledWith('/register');
      });
    });
  });
});
