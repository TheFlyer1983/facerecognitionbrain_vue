import { ref } from 'vue';
import { shallowMount, VueWrapper } from '@vue/test-utils';
import ProfileAvatar from './ProfileAvatar.vue';
import useAvatars from '@/composables/avatars/useAvatars';

vi.mock('@/composables/avatars/useAvatars');

const mockUseAvatars = vi.mocked(useAvatars);
const createAvatarMock = vi.fn();

const mockProps = {
  name: 'Paul'
};

describe('Given the `ProfileAvatar` component', () => {
  const render = () =>
    shallowMount(ProfileAvatar, {
      props: {
        name: mockProps.name
      }
    });
  let wrapper: VueWrapper<InstanceType<typeof ProfileAvatar>>;

  beforeAll(() => {
    mockUseAvatars.mockReturnValue({
      avatar: ref('P'),
      createAvatar: createAvatarMock
    });
  });

  describe('when it is rendered', () => {
    beforeEach(() => {
      wrapper = render();
    });

    it('should match the snapshot', () => {
      expect(wrapper.element).toMatchSnapshot();
    });

    it('should call the `createAvatar` function', () => {
      expect(createAvatarMock).toHaveBeenCalledWith(mockProps.name);
    });
  });
});
