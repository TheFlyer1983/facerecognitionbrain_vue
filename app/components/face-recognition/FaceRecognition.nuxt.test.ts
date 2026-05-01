import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime';
import { reactive, ref } from 'vue';
import type { Face } from '~~/types/image';
import FaceRecognition from './FaceRecognition.vue';

vi.mock('~/middleware/auth', () => ({
  default: vi.fn(() => {})
}));

const { useImageStoreMock } = vi.hoisted(() => ({
  useImageStoreMock: vi.fn()
}));

mockNuxtImport('useImageStore', () => {
  return useImageStoreMock;
});

describe('FaceRecognition', () => {
  const render = async (state?: {
    imageUrl?: string | null;
    boxes?: Face[];
  }) => {
    useImageStoreMock.mockReturnValue(
      reactive({
        imageUrl: ref(state?.imageUrl ?? null),
        boxes: ref(state?.boxes ?? []),
        submitURL: vi.fn()
      })
    );

    return mountSuspended(FaceRecognition, {
      route: '/'
    });
  };

  it('mounts successfully', async () => {
    const component = await render();

    expect(component.exists()).toBe(true);
  });

  it('does not render an image when imageUrl is empty', async () => {
    const component = await render({ imageUrl: null });

    expect(component.find('#inputImage').exists()).toBe(false);
  });

  it('renders the input image when imageUrl exists', async () => {
    const component = await render({ imageUrl: 'https://img.test/face.jpg' });
    const image = component.find('#inputImage');

    expect(image.exists()).toBe(true);
    expect(image.attributes('src')).toBe('https://img.test/face.jpg');
  });

  it('renders one face box per detected face with position styles', async () => {
    const component = await render({
      imageUrl: 'https://img.test/face.jpg',
      boxes: [
        {
          face_token: 'face-1',
          face_rectangle: { top: 10, left: 20, height: 30, width: 40 }
        },
        {
          face_token: 'face-2',
          face_rectangle: { top: 1, left: 2, height: 3, width: 4 }
        }
      ]
    });

    const boxes = component.findAll('span.absolute');

    expect(boxes).toHaveLength(2);
    expect(boxes[0]?.attributes('style')).toContain('top: 10px');
    expect(boxes[0]?.attributes('style')).toContain('left: 20px');
    expect(boxes[0]?.attributes('style')).toContain('height: 30px');
    expect(boxes[0]?.attributes('style')).toContain('width: 40px');
    expect(boxes[1]?.attributes('style')).toContain('top: 1px');
    expect(boxes[1]?.attributes('style')).toContain('left: 2px');
    expect(boxes[1]?.attributes('style')).toContain('height: 3px');
    expect(boxes[1]?.attributes('style')).toContain('width: 4px');
  });
});
