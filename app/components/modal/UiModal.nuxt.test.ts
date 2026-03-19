import { mountSuspended } from '@nuxt/test-utils/runtime';
import UiModal from './UiModal.vue';

describe('Given the UiModal component', () => {
  describe('when the component is rendered', async () => {
    const component = await mountSuspended(UiModal, { route: '/' });

    it('mounts the UiModal component', () => {
      expect(component.exists()).toBe(true);
    });

    describe('when the backdrop is clicked', () => {
      const element = component.find('[data-test="close-modal"]');

      beforeEach(() => {
        element.trigger('click');
      });

      it('should emit the close-modal event', () => {
        expect(component.emitted('close-modal')).toStrictEqual([[]]);
      });
    });
  });

  describe('when the component is rendered with a slot', async () => {
    const component = await mountSuspended(UiModal, { route: '/', slots: { default: '<p data-test="slot">Hello World</p>' } });

    it('should render the slot', () => {
      expect(component.find('[data-test="slot"]').exists()).toBe(true);

      expect(component.find('[data-test="slot"]').text()).toBe('Hello World');
    });
  });
});
