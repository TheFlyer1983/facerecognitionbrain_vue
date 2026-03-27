import { mountSuspended } from '@nuxt/test-utils/runtime';
import ImageLinkForm from './ImageLinkForm.vue';
import { createTestingPinia } from '@pinia/testing';

describe('Given the ImageLinkForm component', () => {
  const render = async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
      initialState: {
        ImageStore: {
          imageUrl: ''
        }
      }
    });

    const component = await mountSuspended(ImageLinkForm, {
      route: '/',
      global: { plugins: [pinia] }
    });

    return { component, store: useImageStore(pinia) };
  };

  describe('when the component is rendered', () => {
    it('mounts the ImageLinkForm component', async () => {
      const { component } = await render();
      expect(component.exists()).toBe(true);
    });

    it('matches the snapshot', async () => {
      const { component } = await render();
      expect(component.element).toMatchSnapshot();
    });

    it('submit button exists', async () => {
      const { component } = await render();
      expect(component.find('[data-test="submit"]').exists()).toBe(true);
    });

    it('input field exists', async () => {
      const { component } = await render();
      expect(component.find('[data-test="input"]').exists()).toBe(true);
    });

    describe('when the submit button is clicked', () => {
      it('should emit the submit event', async () => {
        const { component, store } = await render();
        const submitButton = component.find('[data-test="submit"]');
        await submitButton.trigger('click');
        expect(store.submitURL).toHaveBeenCalledOnce();
      });
    });

    describe('when the input field is changed', () => {
      it('should update the imageUrl in the store', async () => {
        const { component, store } = await render();
        const inputField = component.find('[data-test="input"]');
        await inputField.setValue('https://example.com/image.jpg');
        expect(store.imageUrl).toBe('https://example.com/image.jpg');
      });
    });
  });
});
