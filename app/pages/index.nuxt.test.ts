import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime';
import PagesIndex from './index.vue';

const { navigateToMock } = vi.hoisted(() => ({
  navigateToMock: vi.fn()
}));

mockNuxtImport('navigateTo', () => navigateToMock);

describe('Pages Index', () => {
  describe('and the component mounts', () => {
    let component: Awaited<ReturnType<typeof mountSuspended<typeof PagesIndex>>>;

    beforeEach(async () => {
      navigateToMock.mockClear();
      component = await mountSuspended<typeof PagesIndex>(PagesIndex, {
        route: '/'
      });
    });

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
