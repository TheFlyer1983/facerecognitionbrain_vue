import { mountSuspended } from '@nuxt/test-utils/runtime';
import Home from './index.vue';
import { createTestingPinia } from '@pinia/testing';

vi.mock('~/middleware/auth', () => ({
  default: vi.fn()
}));

describe('Given the Home page', () => {
  const render = async (
    initialState: {
      isSignedIn: boolean;
      id: string | null;
      token: string | null;
      user: { name: string; entries: number } | null;
      rank: string | null;
      isProfileOpen?: boolean;
    } = {
      isSignedIn: false,
      id: null,
      token: null,
      user: null,
      rank: null
    }
  ) => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: true,
      initialState: {
        UserStore: initialState
      }
    });

    return mountSuspended<typeof Home>(Home, {
      route: '/',
      global: { plugins: [pinia] }
    });
  };

  describe('and the component mounts while logged in', () => {
    let component: Awaited<ReturnType<typeof render>>;

    beforeEach(async () => {
      component = await render({
        isSignedIn: true,
        id: 'user123',
        token: 'valid-token',
        user: { name: 'Test User', entries: 5 },
        rank: 'beginner'
      });
    });

    it('the page exists', () => {
      expect(component.exists()).toBe(true);
    });

    it('matches the snapshot', () => {
      expect(component.element).toMatchSnapshot();
    });

    it('should render the RankComponent', () => {
      expect(component.findComponent({ name: 'RankComponent' }).exists()).toBe(
        true
      );
    });
  });

  describe('when the profile modal is opened', () => {
    let component: Awaited<ReturnType<typeof render>>;

    beforeEach(async () => {
      component = await render({
        isSignedIn: true,
        id: 'user123',
        token: 'valid-token',
        user: { name: 'Test User', entries: 5 },
        rank: 'beginner',
        isProfileOpen: true
      });
    });

    it('matches the snapshot', () => {
      expect(component.element).toMatchSnapshot();
    });

    it('should render the ProfileModal', () => {
      expect(component.findComponent({ name: 'ProfileModal' }).exists()).toBe(
        true
      );
    });
  });

  describe('and the component mounts while logged out', () => {
    let component: Awaited<ReturnType<typeof render>>;

    beforeEach(async () => {
      component = await render();
    });

    it('the page exists', () => {
      expect(component.exists()).toBe(true);
    });

    it('matches the snapshot', () => {
      expect(component.element).toMatchSnapshot();
    });

    it('should not render the RankComponent', () => {
      expect(component.findComponent({ name: 'RankComponent' }).exists()).toBe(
        false
      );
    });
  });
});
