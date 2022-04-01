import { describe, expect, it, beforeEach, vi, beforeAll } from 'vitest';
import { shallowMount, VueWrapper } from '@vue/test-utils';
import { reactive } from 'vue';
import { useStore } from 'vuex';
import { useNavigation } from '@/modules/navigation';
import { Routes } from '@/router/routes';

import Register from './Register.vue';

vi.mock('vuex');
vi.mock('@/modules/navigation');

const mockedUseStore = vi.mocked<() => Partial<typeof useStore>>(useStore);
const mockedUseNavigation = vi.mocked(useNavigation, true);

const navigateMock = vi.fn();
const dispatchMock = vi.fn();

const mockedRegisterInfo = {
  name: 'Paul',
  email: 'test@test.com',
  password: 'password'
};

describe('Given the `Register` component', () => {
  const render = () => shallowMount(Register);
  let wrapper: VueWrapper<InstanceType<typeof Register>>;

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
        wrapper.vm.name = mockedRegisterInfo.name;
        wrapper.vm.email = mockedRegisterInfo.email;
        wrapper.vm.password = mockedRegisterInfo.password;
        wrapper.find('[data-test="submit"]').trigger('click');

        dispatchMock.mockReturnValue(true);
      });

      it('should dispatch the correct action', () => {
        expect(mockedStore.dispatch).toHaveBeenCalledWith(
          'user/registerUser',
          mockedRegisterInfo
        );
      });

      it('should navigate to the correct page', () => {
        expect(navigateMock).toHaveBeenCalledWith({ name: Routes.Home });
      });
    });

    describe.each([
      {
        field: 'name',
        value: 'Paul',
        id: 'name'
      },
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
