import { shallowMount, VueWrapper } from '@vue/test-utils';

import { createTestingPinia } from '@pinia/testing';
import { useUserStore } from '@/store/user';
import { useNavigation } from '@/modules/navigation';

import Nav from './Nav.vue';
import { Routes } from '@/router/routes';
import { UserMock } from '@/fixtures/users';

vi.mock('@/modules/navigation');

const navigateMock = vi.fn();

const mockedUseNavigation = vi.mocked(useNavigation, true);

const pinia = createTestingPinia();
const mockUserStore = useUserStore(pinia);

describe('Given the Nav component', () => {
  const render = () =>
    shallowMount(Nav, {
      global: {
        plugins: [pinia],
        stubs: {
          ProfileIcon: false
        }
      }
    });
  let wrapper: VueWrapper<InstanceType<typeof Nav>>;

  beforeAll(() => {
    mockedUseNavigation.mockReturnValue({
      navigate: navigateMock
    });
  });

  describe('when it is rendered', () => {
    beforeEach(() => {
      mockUserStore.$patch({ isSignedIn: true, user: { ...UserMock } });
      wrapper = render();
    });

    it('should match the snapshot', () => {
      expect(wrapper.element).toMatchSnapshot();
    });

    describe('and when the `signOut` function is called', () => {
      beforeEach(() => {
        // wrapper.findComponent(ProfileIcon).//.vm.$emits('signout');
        wrapper.vm.signOut();
      });

      it('should dispatch the correct action', () => {
        expect(mockUserStore.signout).toHaveBeenCalled();
      });

      it('should navigate to the login page', () => {
        expect(navigateMock).toHaveBeenCalledWith({
          name: Routes.Login
        });
      });
    });

    describe('and when the user is logged out', () => {
      beforeEach(() => {
        mockUserStore.$patch({ isSignedIn: false });
      });

      it('should match the snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
      });

      describe('and when the `Sign In` link is clicked', () => {
        beforeEach(() => {
          wrapper.find('[data-test="signin"]').trigger('click');
        });

        it('should navigate to the Login page', () => {
          expect(navigateMock).toHaveBeenCalledWith({
            name: Routes.Login
          });
        });
      });

      describe('and when the `Register` link is clicked', () => {
        beforeEach(() => {
          wrapper.find('[data-test="register"]').trigger('click');
        });

        it('should navigate to the Register page', () => {
          expect(navigateMock).toHaveBeenCalledWith({
            name: Routes.Register
          });
        });
      });
    });
  });
});
