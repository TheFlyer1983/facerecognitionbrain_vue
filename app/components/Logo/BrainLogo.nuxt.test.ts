import { describe, it, expect } from 'vitest';
import BrainLogo from './BrainLogo.vue';
import { mountSuspended } from '@nuxt/test-utils/runtime';

describe('BrainLogo component', async () => { 
  const component = await mountSuspended(BrainLogo, { route: '/' });

  it('mounts the BrainLogo component', () => {
    expect(component.exists()).toBe(true);
  });

  it('matches the snapshot', () => {
    expect(component.element).toMatchSnapshot();
  });
});
