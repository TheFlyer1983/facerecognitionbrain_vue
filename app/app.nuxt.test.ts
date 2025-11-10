import { describe, it, expect } from 'vitest';
import App from './app.vue';
import { mountSuspended } from '@nuxt/test-utils/runtime';

describe('App.vue', async() => { 
  const component = await mountSuspended(App, {route: '/'});

  it('mounts the app component', () => {
    expect(component.exists()).toBe(true);
  });

  it('matches the snapshot', () => {
    expect(component.element).toMatchSnapshot();
  });
});