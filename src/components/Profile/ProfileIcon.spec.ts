import { shallowMount, VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, it, expect, vi, beforeAll } from 'vitest';
import { reactive } from 'vue';
import { useStore } from 'vuex';
import ProfileIcon from './ProfileIcon.vue';

vi.mock('vuex');

const mockedUseStore = vi.mocked<() => Partial<typeof useStore>>(useStore);

const mockedStore = reactive({
  commit: vi.fn()
});

describe('Given the `ProfileIcon` component', () => {
  const render = () => shallowMount(ProfileIcon);
  let wrapper: VueWrapper<InstanceType<typeof ProfileIcon>>;

  beforeAll(() => {
    mockedUseStore.mockReturnValue(mockedStore);
  });

  describe('when it is rendered', () => {
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
        expect(mockedStore.commit).toHaveBeenCalledWith('user/toggleModal');
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
