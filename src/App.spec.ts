import { shallowMount, VueWrapper } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';

import App from './App.vue';

const pinia = createTestingPinia();

describe('Given the App', () => {
  const render = () =>
    shallowMount(App, {
      global: {
        plugins: [pinia],
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
