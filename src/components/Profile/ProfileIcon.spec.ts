import { shallowMount, VueWrapper } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { useUserStore } from '@/store/user';
import ProfileIcon from './ProfileIcon.vue';
import { UserMock } from '@/fixtures/users';

const pinia = createTestingPinia();
const mockUserStore = useUserStore(pinia);

describe('Given the `ProfileIcon` component', () => {
  const render = () =>
    shallowMount(ProfileIcon, {
      global: {
        plugins: [pinia],
        stubs: {
          ProfileAvatar: false
        }
      }
    });
  let wrapper: VueWrapper<InstanceType<typeof ProfileIcon>>;

  describe('when it is rendered', () => {
    beforeAll(() => {
      mockUserStore.$patch({ user: { ...UserMock } });
    });
    beforeEach(() => {
      wrapper = render();
    });

    it('should match the snapshot', () => {
      expect(wrapper.element).toMatchSnapshot();
    });

    describe('and when the `View Profile` link is clicked', () => {
      beforeEach(() => {
        // wrapper.find('[data-test="signout"]').trigger('click');
        wrapper.vm.toggleModal();
      });

      it('should emit the correct event', () => {
        expect(mockUserStore.isProfileOpen).toBe(true);
      });

      it('should update the component state', () => {
        expect(wrapper.vm.isDropdownOpen).toBe(true);
      });
    });

    describe('and when the `Sign Out` link is clicked', () => {
      beforeEach(() => {
        // wrapper.find('[data-test="signout"]').trigger('click');
        wrapper.vm.signOut();
      });

      it('should emit the correct event', () => {
        expect(wrapper.emitted('signout')).toStrictEqual([[]]);
      });
    });
  });
});
