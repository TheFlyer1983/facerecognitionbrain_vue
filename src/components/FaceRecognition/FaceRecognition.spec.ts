import { shallowMount, VueWrapper } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { useImageStore } from '@/store/image';
import FaceRecognition from './FaceRecognition.vue';
import { boxesMock } from '@/fixtures/images';
import { calculateFaceLocations } from '@/functions/imageFunctions';

vi.mock('@/functions/imageFunctions');

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

const pinia = createTestingPinia();
const mockImageStore = useImageStore(pinia);

describe('Given the `FaceRecognition` component', () => {
  const render = () =>
    shallowMount(FaceRecognition, { global: { plugins: [pinia] } });
  let wrapper: VueWrapper<InstanceType<typeof FaceRecognition>>;

  beforeAll(() => {
    mockedCalculateFaceLocations.mockReturnValue(mockedFaceLocation);

    mockImageStore.$patch({
      imageUrl: mockedImageURL,
      boxes: [...boxesMock]
    });
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
