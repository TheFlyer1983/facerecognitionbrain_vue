import { shallowMount, VueWrapper } from '@vue/test-utils';
import { reactive } from 'vue';
import { useStore } from 'vuex';
import { useNavigation } from '@/modules/navigation';

import Profile from './Profile.vue';

import { UserMock } from '@/fixtures/users';
import { User } from '@/store/modules/user/userTypes';
import { Routes } from '@/router/routes';

vi.mock('vuex');
vi.mock('@/modules/navigation');

const navigateMock = vi.fn();

const mockedUseStore = vi.mocked<() => Partial<typeof useStore>>(useStore);
const mockedUseNavigation = vi.mocked(useNavigation, true);

const mockedGetters = {
  ['user/getUser']: UserMock as User | null
};

const mockedStore = reactive({
  getters: mockedGetters,
  commit: vi.fn(),
  dispatch: vi.fn()
});

describe('Given the `Profile` component', () => {
  const render = () =>
    shallowMount(Profile, {
      global: {
        stubs: {
          Modal: false
        }
      }
    });
  let wrapper: VueWrapper<InstanceType<typeof Profile>>;

  beforeAll(() => {
    mockedUseStore.mockReturnValue(mockedStore);
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
        expect(mockedStore.commit).toHaveBeenCalledWith('user/toggleModal');
      });
    });

    describe('and when the user getter returns no age value', () => {
      beforeEach(() => {
        mockedStore.getters['user/getUser'] = null;
      });

      it('and the placeholder text should be blank', () => {
        expect(wrapper.vm.agePlaceHolderText).toBe('');
      });
    });

    describe('and when the `updateProfile` function is called', () => {
      beforeEach(() => {
        mockedStore.getters['user/getUser'] = UserMock;
      });

      describe('and when there are no values entered', () => {
        beforeEach(() => {
          wrapper.vm.updateProfile();
        });

        it('should not dispatch the action', () => {
          expect(mockedStore.dispatch).not.toHaveBeenCalled();
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
            expect(mockedStore.dispatch).not.toHaveBeenCalled();
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
          expect(mockedStore.dispatch).toHaveBeenCalledWith(
            'user/updateUser',
            userInfo
          );
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
          expect(mockedStore.dispatch).toHaveBeenCalledWith('user/deleteUser');

          expect(mockedStore.dispatch).toHaveBeenCalledWith('user/signOut');
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
          expect(mockedStore.commit).toHaveBeenCalledWith('user/toggleModal');
        });
      });
    });
  });
});
