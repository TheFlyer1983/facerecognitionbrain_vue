import { shallowMount, VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, it, expect, vi, beforeAll } from 'vitest';
import { reactive } from 'vue';
import { useStore } from 'vuex';

import Rank from './Rank.vue';
import { UserState } from '@/store/modules/user/userTypes';

const mockProps = {
  user: {
    id: 1,
    name: 'Paul',
    email: 'test@test.com',
    entries: 1,
    joined: '2021-04-09T00:00:00.000Z',
    pet: 'Ruby',
    age: 37
  }
};

vi.mock('vuex');

const mockedUseStore = vi.mocked<() => Partial<typeof useStore>>(useStore);

describe('Given the `Rank` component', () => {
  const render = () => shallowMount(Rank, { props: { user: mockProps.user } });
  let wrapper: VueWrapper<InstanceType<typeof Rank>>;

  const mockedGetters = {
    ['user/getRank']: '😃' as UserState['rank']
  };

  const storeMock = reactive({
    getters: mockedGetters
  });

  beforeAll(() => {
    mockedUseStore.mockReturnValue(storeMock);
  });

  describe('when it is rendered', () => {
    beforeEach(() => {
      wrapper = render();
    });

    it('should match the snapshot', () => {
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
