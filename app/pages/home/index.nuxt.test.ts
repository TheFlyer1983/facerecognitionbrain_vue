import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import Home from './index.vue';
import { createTestingPinia } from '@pinia/testing';

vi.mock('~/middleware/auth', () => ({
  default: vi.fn()
}));

describe('Given the Home page', async () => {
  describe('and the component mounts while logged in', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: true,
      initialState: {
        UserStore: {
          isSignedIn: true,
          id: 'user123',
          token: 'valid-token',
          user: { name: 'Test User', entries: 5 },
          rank: 'beginner'
        }
      }
    });

    const component = await mountSuspended<typeof Home>(Home, {
      route: '/home',
      global: { plugins: [pinia] }
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

  describe('when the profile modal is opened', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: true,
      initialState: {
        UserStore: {
          isSignedIn: true,
          id: 'user123',
          token: 'valid-token',
          user: { name: 'Test User', entries: 5 },
          rank: 'beginner',
          isProfileOpen: true
        }
      }
    });

    const component = await mountSuspended<typeof Home>(Home, {
      route: '/home',
      global: { plugins: [pinia] }
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

  describe('and the component mounts while logged out', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: true
    });

    const component = await mountSuspended<typeof Home>(Home, {
      route: '/home',
      global: { plugins: [pinia] }
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
