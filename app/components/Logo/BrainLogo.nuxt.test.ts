import BrainLogo from './BrainLogo.vue';
import { mountSuspended } from '@nuxt/test-utils/runtime';

describe('BrainLogo component', () => {
  let component: Awaited<ReturnType<typeof mountSuspended>>;

  beforeEach(async () => {
    component = await mountSuspended(BrainLogo, { route: '/' });
  });

  it('mounts the BrainLogo component', () => {
    expect(component.exists()).toBe(true);
  });

  it('matches the snapshot', () => {
    expect(component.element).toMatchSnapshot();
  });
});
