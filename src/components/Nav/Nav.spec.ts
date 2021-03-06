import { reactive } from 'vue';
import { shallowMount, VueWrapper } from '@vue/test-utils';
import { describe, beforeEach, it, expect, vi, beforeAll } from 'vitest';
import { useStore } from 'vuex';
import { useNavigation } from '@/modules/navigation';

import Nav from './Nav.vue';
import { UserState } from '@/store/modules/user/userTypes';
import { Routes } from '@/router/routes';

vi.mock('vuex');
vi.mock('@/modules/navigation');

const dispatchMock = vi.fn();
const navigateMock = vi.fn();

const mockedUseStore = vi.mocked<() => Partial<typeof useStore>>(useStore);
const mockedUseNavigation = vi.mocked(useNavigation, true);

describe('Given the Nav component', () => {
  const render = () => shallowMount(Nav);
  let wrapper: VueWrapper<InstanceType<typeof Nav>>;

  const mockedGetters = {
    ['user/getIsSignedId']: true as UserState['isSignedIn']
  };

  const storeMock = reactive({
    getters: mockedGetters,
    dispatch: dispatchMock
  });

  beforeAll(() => {
    mockedUseStore.mockReturnValue(storeMock);
    mockedUseNavigation.mockReturnValue({
      navigate: navigateMock
    });
  });

  describe('when it is rendered', () => {
    beforeEach(() => {
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
        expect(storeMock.dispatch).toHaveBeenCalledWith('user/signOut');
      });

      it('should navigate to the login page', () => {
        expect(navigateMock).toHaveBeenCalledWith({
          name: Routes.Login
        });
      });
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
