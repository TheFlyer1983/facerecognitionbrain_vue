import { shallowMount, VueWrapper } from '@vue/test-utils';
import { describe, beforeEach, it, expect, vi, beforeAll } from 'vitest';

import Modal from './Modal.vue';

describe('Given the modal component', () => {
  const render = () => shallowMount(Modal);
  let wrapper: VueWrapper<InstanceType<typeof Modal>>;

  describe('when it is rendered', () => {
    beforeEach(() => {
      wrapper = render();
    });

    it('should match the snapshot', () => {
      expect(wrapper.element).toMatchSnapshot();
    });

    describe('and when the overlay is clicked', () => {
      beforeEach(() => {
        wrapper.find('[data-test="close-modal"]').trigger('click');
      });

      it('should emit the correct event', () => {
        expect(wrapper.emitted('close-modal')).toStrictEqual([[]])
      })
    });
  });
});
