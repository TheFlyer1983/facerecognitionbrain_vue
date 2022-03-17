import { shallowMount, VueWrapper } from '@vue/test-utils';
import { describe, beforeEach, it, expect } from 'vitest';

import App from './App.vue';

describe('Given the App', () => {
  const render = () =>
    shallowMount(App, {
      global: {
        stubs: {
          'router-view': true,
          Particles: true
        }
      }
    });
  let wrapper: VueWrapper<InstanceType<typeof App>>;

  describe('when it is rendered', () => {
    beforeEach(() => {
      wrapper = render();
    });

    it('should match the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
