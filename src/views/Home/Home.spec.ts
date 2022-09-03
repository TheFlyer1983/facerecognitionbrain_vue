import { describe, expect, it, beforeEach, vi, beforeAll } from 'vitest';
import { shallowMount, VueWrapper } from '@vue/test-utils';
import { reactive } from 'vue';
import { useStore } from 'vuex';

import Home from './Home.vue';
import { UserMock } from '@/fixtures/users';
import { User, UserState } from '@/store/modules/user/userTypes';

const RankMock = '😀';
vi.mock('vuex');

const mockedUseStore = vi.mocked<() => Partial<typeof useStore>>(useStore);

describe('Given the `Home` component', () => {
  const render = () =>
    shallowMount(Home, {
      global: {
        stubs: {
          teleport: true,
          Logo: false,
          Rank: false,
          ImageLinkForm: false
        }
      }
    });
  let wrapper: VueWrapper<InstanceType<typeof Home>>;

  const mockedGetters = {
    ['user/getUser']: UserMock as User | null,
    ['user/getRank']: RankMock as UserState['rank'],
    ['user/getIsProfileOpen']: false
  };

  const mockStore = reactive({
    getters: mockedGetters,
    dispatch: vi.fn()
  });

  beforeAll(() => {
    mockedUseStore.mockReturnValue(mockStore);
  });

  describe('when it is rendered', () => {
    beforeEach(() => {
      wrapper = render();
    });

    it('should match the snapshot', () => {
      expect(wrapper.element).toMatchSnapshot();
    });

    describe('when there is no current user loaded', () => {
      beforeEach(() => {
        mockStore.getters['user/getUser'] = null;

        wrapper = render();
      });

      it('should dispatch the correct action', () => {
        expect(mockStore.dispatch).toHaveBeenCalledWith('user/getToken');
      });
    });

    describe('when the profile modal is open', () => {
      beforeEach(() => {
        mockStore.getters['user/getIsProfileOpen'] = true;
      });

      it('should match the snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
      });
    });
  });
});
