import { shallowMount, VueWrapper } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { useImageStore } from '@/store/modules/image';
import ImageLinkForm from './ImageLinkForm.vue';

const mockedImageURL =
  'https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGZhY2V8ZW58MHx8MHx8&w=1000&q=80';

const pinia = createTestingPinia();
const mockImageStore = useImageStore(pinia);

describe('Given the `ImageLinkForm` component', () => {
  const render = () =>
    shallowMount(ImageLinkForm, { global: { plugins: [pinia] } });
  let wrapper: VueWrapper<InstanceType<typeof ImageLinkForm>>;

  describe('when it is rendered', () => {
    beforeEach(() => {
      wrapper = render();
    });

    it('should match the snapshot', () => {
      expect(wrapper.element).toMatchSnapshot();
    });

    describe('when a new image is input', () => {
      beforeEach(() => {
        wrapper.find('input').setValue(mockedImageURL);
      });

      it('should update the state correctly', () => {
        expect(mockImageStore.imageUrl).toStrictEqual(mockedImageURL);
      });
    });

    describe('when the submit button is clicked', () => {
      beforeEach(() => {
        wrapper.find('[data-test="submit"]').trigger('click');
      });

      it('should dispatch the correct action', () => {
        expect(mockImageStore.submitURL).toHaveBeenCalled();
      });
    });
  });
});
