import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime';
import ProfileIcon from './ProfileIcon.vue';
import { createTestingPinia } from '@pinia/testing';
import { useUserStore } from '~/stores/user';

const createPinia = (overrides = {}) =>
  createTestingPinia({
    createSpy: vi.fn,
    stubActions: true,
    initialState: {
      UserStore: {
        isSignedIn: true,
        ...overrides
      }
    }
  });

const render = async (overrides = {}) => {
  const pinia = createPinia(overrides);
  const component = await mountSuspended(ProfileIcon, {
    global: { plugins: [pinia] }
  });

  return { component, pinia, store: useUserStore(pinia) };
};

const expectedMenuItems = ['view-profile', 'signout'];

describe('Given the ProfileIcon component', () => {
  let component: Awaited<ReturnType<typeof render>>['component'];
  let store: Awaited<ReturnType<typeof render>>['store'];

  describe('when the component is rendered', () => {
    beforeEach(async () => {
      ({ component } = await render({ user: { name: 'Test User' } }));
    });

    it('mounts the ProfileIcon component', () => {
      const avatar = component.findComponent({ name: 'ProfileAvatar' });
      expect(avatar.exists()).toBe(true);
    });

    it('matches the snapshot', () => {
      expect(component.element).toMatchSnapshot();
    });
  });

  describe('when the user is logged in', () => {
    describe('and the profile icon is clicked', () => {
      beforeEach(async () => {
        ({ component } = await render({ user: { name: 'Test User' } }));
        const avatar = component.find(`[data-test="profile-avatar"]`);

        await avatar.trigger('click');

        await nextTick();
      });

      it('should render the menu items', () => {
        for (const key of expectedMenuItems) {
          expect(component.find(`[data-test="${key}"]`).exists()).toBe(true);
        }
      });

      describe('and when the signout option is clicked', () => {
        beforeEach(async () => {
          await component.find(`[data-test="signout"]`).trigger('click');

          await nextTick();
        });

        it('should emit the signout event', () => {
          expect(component.emitted('signout')).toStrictEqual([[]]);
        });
      });
    });

    describe('when the profile icon is clicked multiple times', () => {
      it('should toggle the dropdown on repeated clicks', async () => {
        ({ component } = await render({ user: { name: 'Test User' } }));

        const trigger = component.find(`[data-test="profile-avatar"]`);
        const signout = () => component.find(`[data-test="signout"]`);

        expect(signout().exists()).toBe(false);

        await trigger.trigger('click');

        expect(signout().exists()).toBe(true);

        await trigger.trigger('click');

        expect(signout().exists()).toBe(false);
      });

      describe('and the view profile option is clicked', () => {
        it(`should open the profile modal`, async () => {
          ({ component, store } = await render({
            user: { name: 'Test User' }
          }));

          const trigger = component.find(`[data-test="profile-avatar"]`);
          const viewProfile = () =>
            component.find(`[data-test="view-profile"]`);

          for (const key of expectedMenuItems) {
            expect(component.find(`[data-test="${key}"]`).exists()).toBe(false);
          }
          expect(store.isProfileOpen).toBe(false);

          await trigger.trigger('click');

          for (const key of expectedMenuItems) {
            expect(component.find(`[data-test="${key}"]`).exists()).toBe(true);
          }

          await viewProfile().trigger('click');
          expect(store.isProfileOpen).toBe(true);

          for (const key of expectedMenuItems) {
            expect(component.find(`[data-test="${key}"]`).exists()).toBe(false);
          }
        });
      });
    });
  });

  describe('when the user is not logged in', () => {
    it('should not render the profile icon', async () => {
      ({ component } = await render({ user: null }));

      const avatar = component.findComponent({ name: 'ProfileAvatar' });
      expect(avatar.exists()).toBe(false);
    });
  });
});
