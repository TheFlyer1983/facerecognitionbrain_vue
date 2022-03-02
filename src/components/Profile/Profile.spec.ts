import { shallowMount, VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, it, expect, vi, beforeAll } from 'vitest';
import { reactive } from 'vue';
import { useStore } from 'vuex';

import Profile from './Profile.vue';

import { UserMock } from '@/fixtures/users';
import { User } from '@/store/modules/user/userTypes';

vi.mock('vuex');

const mockedUseStore = vi.mocked<() => Partial<typeof useStore>>(useStore);

const mockedGetters = {
  ['user/getUser']: UserMock as User | null
};

const mockedStore = reactive({
  getters: mockedGetters,
  commit: vi.fn(),
  dispatch: vi.fn()
});

describe('Given the `Profile` component', () => {
  const render = () => shallowMount(Profile);
  let wrapper: VueWrapper<InstanceType<typeof Profile>>;

  beforeAll(() => {
    mockedUseStore.mockReturnValue(mockedStore);
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
  });
});
