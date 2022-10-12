import { shallowMount, VueWrapper } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { useUserStore } from '@/store/modules/user';
import { useNavigation } from '@/modules/navigation';

import Profile from './Profile.vue';

import { UserMock } from '@/fixtures/users';
import { Routes } from '@/router/routes';

vi.mock('vuex');
vi.mock('@/modules/navigation');

const navigateMock = vi.fn();

const mockedUseNavigation = vi.mocked(useNavigation, true);

const pinia = createTestingPinia();
const mockUserStore = useUserStore(pinia);

describe('Given the `Profile` component', () => {
  const render = () =>
    shallowMount(Profile, {
      global: {
        plugins: [pinia],
        stubs: {
          Modal: false
        }
      }
    });
  let wrapper: VueWrapper<InstanceType<typeof Profile>>;

  beforeAll(() => {
    mockUserStore.$patch({ user: { ...UserMock } });
    mockedUseNavigation.mockReturnValue({ navigate: navigateMock });
  });

  describe('and when the component is rendered', () => {
    beforeEach(() => {
      wrapper = render();
    });

    it('should match the snapshot', () => {
      expect(wrapper.element).toMatchSnapshot();
    });

    describe('when the close modal function is called', () => {
      beforeEach(() => {
        wrapper.vm.closeModal();
      });

      it('should commit the correct mutation', () => {
        expect(mockUserStore.isProfileOpen).toBe(false);
      });
    });

    describe('and when the user getter returns no age value', () => {
      beforeEach(() => {
        mockUserStore.$patch({ user: null });
      });

      it('and the placeholder text should be blank', () => {
        expect(wrapper.vm.agePlaceHolderText).toBe('');
      });
    });

    describe('and when the `updateProfile` function is called', () => {
      beforeEach(() => {
        mockUserStore.$patch({ user: { ...UserMock } });
      });

      describe('and when there are no values entered', () => {
        beforeEach(() => {
          wrapper.vm.updateProfile();
        });

        it('should not dispatch the action', () => {
          expect(mockUserStore.updateUser).not.toHaveBeenCalled();
        });
      });

      describe.each([
        { key: UserMock.name, inputField: 'userName' },
        { key: UserMock.age, inputField: 'age' },
        { key: UserMock.pet, inputField: 'pet' }
      ])(
        'and when the userName has been entered, but has the same value',
        (arg) => {
          beforeEach(() => {
            wrapper.vm[arg.inputField] = arg.key;
            wrapper.vm.updateProfile();
          });

          it('should not dispatch the action', () => {
            expect(mockUserStore.updateUser).not.toHaveBeenCalled();
          });
        }
      );

      describe.each([
        {
          key: 'Peter',
          inputField: 'userName',
          property: 'name'
        },
        {
          key: 40,
          inputField: 'age',
          property: 'age'
        },
        {
          key: 'Audrey',
          inputField: 'pet',
          property: 'pet'
        }
      ])('and when the userName has been entered', (arg) => {
        const userInfo = {
          [arg.property]: arg.key
        };
        beforeEach(() => {
          wrapper.vm[arg.inputField] = arg.key;
          wrapper.vm.updateProfile();
        });

        it('should not dispatch the action', () => {
          expect(mockUserStore.updateUser).toHaveBeenCalledWith(userInfo);
        });
      });
    });

    describe('and when then `Delete` button is clicked', () => {
      beforeEach(() => {
        wrapper.find('[data-test="delete"]').trigger('click');
      });

      it('should update the `showConfirmation` value', () => {
        expect(wrapper.vm.showConfirmation).toBe(true);
      });

      it('should match the snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
      });

      describe('and when the `Yes` button is clicked', () => {
        beforeEach(() => {
          wrapper.find('[data-test="confirm"]').trigger('click');
        });

        it('should dispatch the correct actions', () => {
          expect(mockUserStore.deleteUser).toHaveBeenCalledWith();
        });

        it('should navigate to the correct page', () => {
          expect(navigateMock).toHaveBeenCalledWith({ name: Routes.Login });
        });
      });

      describe('and when the `Cancel` button is clicked', () => {
        beforeEach(() => {
          wrapper.find('[data-test="cancel-delete"]').trigger('click');
        });

        it('should commit the correct mutation', () => {
          expect(mockUserStore.isProfileOpen).toBe(false);
        });
      });
    });
  });
});
