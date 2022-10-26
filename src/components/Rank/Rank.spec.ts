import { shallowMount, VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, it, expect } from 'vitest';

import Rank from './Rank.vue';

const mockProps = {
  user: {
    id: 1,
    name: 'Paul',
    email: 'test@test.com',
    entries: 1,
    joined: '2021-04-09T00:00:00.000Z',
    pet: 'Ruby',
    age: 37
  },
  userRank: '😀'
};

describe('Given the `Rank` component', () => {
  const render = () => shallowMount(Rank, { props: mockProps });
  let wrapper: VueWrapper<InstanceType<typeof Rank>>;

  describe('when it is rendered', () => {
    beforeEach(() => {
      wrapper = render();
    });

    it('should match the snapshot', () => {
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
