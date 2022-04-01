import { describe, expect, it, beforeEach, vi, beforeAll } from 'vitest';
import { shallowMount, VueWrapper } from '@vue/test-utils';
import { reactive } from 'vue';
import { useStore } from 'vuex';
import { useNavigation } from '@/modules/navigation';
import { Routes } from '@/router/routes';

import Login from './Login.vue';

vi.mock('vuex');
vi.mock('@/modules/navigation');

const mockedUseStore = vi.mocked<() => Partial<typeof useStore>>(useStore);
const mockedUseNavigation = vi.mocked(useNavigation, true);

const navigateMock = vi.fn();
const dispatchMock = vi.fn();

const mockedLoginInfo = {
  email: 'test@test.com',
  password: 'password'
};

describe('Given the `Login` component', () => {
  const render = () => shallowMount(Login);
  let wrapper: VueWrapper<InstanceType<typeof Login>>;

  const mockedStore = reactive({
    dispatch: dispatchMock
  });

  beforeAll(() => {
    mockedUseStore.mockReturnValue(mockedStore);
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

    describe('when the submit button is clicked', () => {
      beforeEach(() => {
        wrapper.vm.email = mockedLoginInfo.email;
        wrapper.vm.password = mockedLoginInfo.password;
        wrapper.find('[data-test="submit"]').trigger('click');

        dispatchMock.mockReturnValue(true)
      });

      it('should dispatch the correct action', () => {
        expect(mockedStore.dispatch).toHaveBeenCalledWith(
          'user/login',
          mockedLoginInfo
        );
      });

      it('should navigate to the correct page', () => {
        expect(navigateMock).toHaveBeenCalledWith({ name: Routes.Home });
      });
    });

    describe('when the register button is clicked', () => {
      beforeEach(() => {
        wrapper.find('[data-test="register"]').trigger('click');
      });

      it('should navigate to the correct page', () => {
        expect(navigateMock).toHaveBeenCalledWith({
          name: Routes.Register
        });
      });
    });

    describe.each([
      {
        field: 'email',
        value: 'test@test.com',
        id: 'email-address'
      },
      {
        field: 'password',
        value: 'password',
        id: 'password'
      }
    ])('when the inputs are updated', (arg) => {
      describe(`when the ${arg.field} is updated`, () => {
        beforeEach(() => {
          wrapper.find(`[id="${arg.id}"]`).setValue(arg.value);
        });

        it(`should update the ${arg.field} property`, () => {
          expect(wrapper.vm[arg.field]).toBe(arg.value);
        });
      });
    });
  });
});
