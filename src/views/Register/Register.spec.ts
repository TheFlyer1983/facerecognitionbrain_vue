import { describe, expect, it, beforeEach, vi, beforeAll } from 'vitest';
import { shallowMount, VueWrapper } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { useUserStore } from '@/store/user';
import { useNavigation } from '@/modules/navigation';
import { Routes } from '@/router/routes';

import Register from './Register.vue';
import { UserMock } from '@/fixtures/users';

vi.mock('@/modules/navigation');

const mockedUseNavigation = vi.mocked(useNavigation, true);

const navigateMock = vi.fn();

const mockedRegisterInfo = {
  name: 'Paul',
  email: 'test@test.com',
  password: 'password'
};

const pinia = createTestingPinia();
const mockUserStore = useUserStore(pinia);

describe('Given the `Register` component', () => {
  const render = () => shallowMount(Register, { global: { plugins: [pinia] } });
  let wrapper: VueWrapper<InstanceType<typeof Register>>;

  beforeAll(() => {
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

        mockUserStore.$patch({ user: { ...UserMock } });

        wrapper.find('[data-test="submit"]').trigger('click');
      });

      it('should dispatch the correct action', () => {
        expect(mockUserStore.registerUser).toHaveBeenCalledWith(
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
