import { shallowMount, VueWrapper } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { useUserStore } from '@/store/modules/user';

import Home from './Home.vue';
import { UserMock } from '@/fixtures/users';

const pinia = createTestingPinia();
const mockUserStore = useUserStore(pinia);

const RankMock = '😀';

describe('Given the Home component', () => {
  const render = () =>
    shallowMount(Home, {
      global: {
        plugins: [pinia],
        stubs: {
          teleport: true,
          Logo: false,
          Rank: false,
          ImageLinkForm: false,
          FaceRecognition: false
        }
      }
    });
  let wrapper: VueWrapper<InstanceType<typeof Home>>;

  describe('when it is rendered', () => {
    beforeEach(() => {
      mockUserStore.$patch({
        user: { ...UserMock },
        rank: RankMock,
        isProfileOpen: false
      });

      wrapper = render();
    });

    it('should match the snapshot', () => {
      expect(wrapper.element).toMatchSnapshot();
    });

    describe('when there is no current user loaded', () => {
      beforeEach(() => {
        mockUserStore.$patch({ user: null });

        wrapper = render();
      });

      it('should dispatch the correct action', () => {
        expect(mockUserStore.getToken).toHaveBeenCalled();
      });
    });

    describe('when the profile modal is open', () => {
      beforeEach(() => {
        mockUserStore.$patch({ isProfileOpen: true });
      });

      it('should match the snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
      });
    });
  });
});
