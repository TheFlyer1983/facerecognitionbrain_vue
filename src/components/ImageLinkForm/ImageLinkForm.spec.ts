import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { shallowMount, VueWrapper } from '@vue/test-utils';
import { reactive } from 'vue';
import { useStore } from 'vuex';

import ImageLinkForm from './ImageLinkForm.vue';
import { ImageState } from '@/store/modules/image/imageTypes';

vi.mock('vuex');

const mockedUseStore = vi.mocked<() => Partial<typeof useStore>>(useStore);

const mockedImageURL =
  'https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGZhY2V8ZW58MHx8MHx8&w=1000&q=80';

describe('Given the `ImageLinkForm` component', () => {
  const render = () => shallowMount(ImageLinkForm);
  let wrapper: VueWrapper<InstanceType<typeof ImageLinkForm>>;

  const mockedGetters = {
    ['image/getImageURL']: '' as ImageState['imageUrl']
  };

  const mockedStore = reactive({
    getters: mockedGetters,
    commit: vi.fn(),
    dispatch: vi.fn()
  });

  beforeAll(() => {
    mockedUseStore.mockReturnValue(mockedStore);
  });

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

      it('should commit the correct mutation', () => {
        expect(mockedStore.commit).toHaveBeenCalledWith(
          'image/setImageURL',
          mockedImageURL
        );
      });
    });

    describe('when the submit button is clicked', () => {
      beforeEach(() => {
        wrapper.find('[data-test="submit"]').trigger('click');
      });

      it('should dispatch the correct action', () => {
        expect(mockedStore.dispatch).toHaveBeenCalledWith('image/submitURL');
      });
    });
  });
});
