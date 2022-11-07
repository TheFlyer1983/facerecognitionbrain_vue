import { shallowMount, VueWrapper } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { useUserStore } from '@/store/user';
import { useNavigation } from '@/modules/navigation';
import { Routes } from '@/router/routes';

import Login from './Login.vue';

vi.mock('@/modules/navigation');

const mockedUseNavigation = vi.mocked(useNavigation);

const navigateMock = vi.fn();

const mockedLoginInfo = {
  email: 'test@test.com',
  password: 'password'
};

const pinia = createTestingPinia();
const mockUserStore = useUserStore(pinia);

describe('Given the `Login` component', () => {
  const render = () => shallowMount(Login, { global: { plugins: [pinia] } });
  let wrapper: VueWrapper<InstanceType<typeof Login>>;

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
      beforeEach(async () => {
        wrapper.vm.email = mockedLoginInfo.email;
        wrapper.vm.password = mockedLoginInfo.password;

        mockUserStore.$patch({ id: '123ABC123' });

        wrapper.find('[data-test="submit"]').trigger('click');
      });

      it('should dispatch the correct action', () => {
        expect(mockUserStore.login).toHaveBeenCalledWith(mockedLoginInfo);
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
