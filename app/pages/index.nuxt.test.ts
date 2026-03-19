import { describe, it, expect, vi } from 'vitest';
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime';
import PagesIndex from './index.vue';

const component = await mountSuspended<typeof PagesIndex>(PagesIndex, {
  route: '/'
});

const { navigateToMock } = vi.hoisted(() => ({
  navigateToMock: vi.fn()
}));

mockNuxtImport('navigateTo', () => navigateToMock);

describe('Pages Index', async () => {
  describe('and the component mounts', async () => {
    it('the page exists', () => {
      expect(component.exists()).toBe(true);
    });

    it('matches the snapshot', () => {
      expect(component.element).toMatchSnapshot();
    });

    it('should redirect to /home', () => {
      expect(navigateToMock).toHaveBeenCalledWith('/home');
    });
  });
});
