import App from './app.vue';
import { mountSuspended } from '@nuxt/test-utils/runtime';

describe('App.vue', () => {
  let component: Awaited<ReturnType<typeof mountSuspended>>;

  beforeEach(async () => {
    component = await mountSuspended(App, { route: '/login' });
  }); // = await mountSuspended(App, { route: '/login' });

  it('mounts the app component', () => {
    expect(component.exists()).toBe(true);
  });

  it('matches the snapshot', () => {
    // expect(component.element).toMatchSnapshot();
    const shell = component.find('.particles.py-3');
    expect(shell.exists()).toBe(true);
    expect(shell.element).toMatchSnapshot();
  });

  it('renders the particles wrapper element', () => {
    const particles = component.find('.particles');
    expect(particles.exists()).toBe(true);
  });

  it('applies the py-3 class to the particles wrapper', () => {
    const wrapper = component.find('.py-3');
    expect(wrapper.exists()).toBe(true);
  });

  it('renders a non-empty component', () => {
    expect(component.html()).not.toBe('');
  });
});