import { mountSuspended } from '@nuxt/test-utils/runtime';
import ImageLinkForm from './ImageLinkForm.vue';
import { createTestingPinia } from '@pinia/testing';

const pinia = createTestingPinia({
  createSpy: vi.fn,
  stubActions: false,
  initialState: {
    ImageStore: {
      imageUrl: ''
    }
  }
});

const mockImageStore = useImageStore(pinia);

describe('Given the ImageLinkForm component', () => {
  describe('when the component is rendered', async () => {
    const component = await mountSuspended(ImageLinkForm, { route: '/', global: { plugins: [pinia] } });

    it('mounts the ImageLinkForm component', () => {
      expect(component.exists()).toBe(true);
    });

    it('matches the snapshot', () => {
      expect(component.element).toMatchSnapshot();
    });

    it('submit button exists', () => {
      expect(component.find('[data-test="submit"]').exists()).toBe(true);
    })

    it('input field exists', () => {
      expect(component.find('[data-test="input"]').exists()).toBe(true);
    })

    describe('when the submit button is clicked', () => {
      const submitButton = component.find('[data-test="submit"]');

      beforeEach(() => {
        submitButton.trigger('click');
      });

      it('should emit the submit event', () => {
        expect(mockImageStore.submitURL).toHaveBeenCalledOnce();
      });
    })

    describe('when the input field is changed', () => {
      const inputField = component.find('[data-test="input"]');

      beforeEach(() => {
        inputField.setValue('https://example.com/image.jpg');
      });

      it('should update the imageUrl in the store', () => {
        expect(mockImageStore.imageUrl).toBe('https://example.com/image.jpg');
      });
    });
  });
});