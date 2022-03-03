import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { shallowMount, VueWrapper } from '@vue/test-utils';
import { reactive } from 'vue';
import { useStore } from 'vuex';

import FaceRecognition from './FaceRecognition.vue';
import { ImageState } from '@/store/modules/image/imageTypes';
import { boxesMock } from '@/fixtures/images';
import { calculateFaceLocations } from '@/functions/imageFunctions';

vi.mock('vuex');
vi.mock('@/functions/imageFunctions');

const mockedUseStore = vi.mocked<() => Partial<typeof useStore>>(useStore);
const mockedCalculateFaceLocations = vi.mocked(calculateFaceLocations, true);

const mockedImageURL =
  'https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGZhY2V8ZW58MHx8MHx8&w=1000&q=80';

const mockedFaceLocation = [
  {
    leftCol: 105.42601499999999,
    topRow: 74.074805,
    rightCol: 122.83062999999999,
    bottomRow: 44.97919999999999
  }
];

describe('Given the `FaceRecognition` component', () => {
  const render = () => shallowMount(FaceRecognition);
  let wrapper: VueWrapper<InstanceType<typeof FaceRecognition>>;

  const mockedGetters = {
    ['image/getImageURL']: mockedImageURL as ImageState['imageUrl'],
    ['image/getBoxes']: boxesMock as ImageState['boxes']
  };

  const mockedStore = reactive({
    getters: mockedGetters
  });

  beforeAll(() => {
    mockedUseStore.mockReturnValue(mockedStore);
    mockedCalculateFaceLocations.mockReturnValue(mockedFaceLocation);
  });

  describe('when it is rendered', () => {
    beforeEach(() => {
      wrapper = render();
    });

    it('should match the snapshot', () => {
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
