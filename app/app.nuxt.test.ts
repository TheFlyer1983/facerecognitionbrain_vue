import App from './app.vue';
import { mountSuspended } from '@nuxt/test-utils/runtime';

describe('App.vue', () => {
  let component: Awaited<ReturnType<typeof mountSuspended>>;

  beforeEach(async () => {
    component = await mountSuspended(App, { route: '/login' });
  });

  it('mounts the app component', () => {
    expect(component.exists()).toBe(true);
  });

  it('matches the snapshot', () => {
    expect(component.element).toMatchSnapshot();
  });
});
