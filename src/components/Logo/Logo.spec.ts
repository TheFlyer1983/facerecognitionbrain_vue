import { beforeEach, describe, expect, it } from 'vitest';
import { shallowMount, VueWrapper } from '@vue/test-utils';
import Logo from './Logo.vue';

describe('Given the Logo component', () => {
  const render = () => shallowMount(Logo);
  let wrapper: VueWrapper<InstanceType<typeof Logo>>;

  describe('when it is rendered', () => {
    beforeEach(() => {
      wrapper = render();
    });
    
    it('should match the snapshot', () => {
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
