import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime';
import { createTestingPinia } from '@pinia/testing';
import { useUserStore } from '~/stores/user';
import RegisterPage from './index.vue';

const { navigateToMock } = vi.hoisted(() => ({
  navigateToMock: vi.fn()
}));

mockNuxtImport('navigateTo', () => navigateToMock);

const mockedRegisterInfo = {
  name: 'Test User',
  password: 'password123',
  email: 'test@test.com'
};

describe('Register Page', () => {
  const render = async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: ['registerUser']
    });
    const component = await mountSuspended(RegisterPage, {
      global: {
        plugins: [pinia]
      },
      route: '/register'
    });
    return { component, store: useUserStore(pinia) };
  };

  beforeEach(() => {
    navigateToMock.mockClear();
  });

  describe('when the component is rendered', () => {
    it('can mount the component', async () => {
      const { component } = await render();
      expect(component.exists()).toBe(true);
      expect(component.html()).toContain('Register');
    });

    it('should match the snapshot', async () => {
      const { component } = await render();
      expect(component.element).toMatchSnapshot();
    });
  });

  describe('When the sign in link is clicked', () => {
    it('should exist', async () => {
      const { component } = await render();
      const signInLink = component.find('[data-test="login"]');
      expect(signInLink.exists()).toBe(true);
    });

    it('should navigate to the login page', async () => {
      const { component } = await render();
      const signInLink = component.find('[data-test="login"]');
      await signInLink.trigger('click');
      expect(navigateToMock).toHaveBeenCalledWith('/login');
    });
  });

  describe('When the submit button is clicked', () => {
    it('should exist', async () => {
      const { component } = await render();
      const submitButton = component.find('[data-test="submit"]');
      expect(submitButton.exists()).toBe(true);
    });

    describe('with valid register information', () => {
      it('should call the register function with the register information', async () => {
        const { component, store } = await render();
        component.find('[id="name"]').setValue('Test User');
        component.find('[id="email-address"]').setValue('test@test.com');
        component.find('[id="password"]').setValue('password123');
        store.$patch({ id: 'user123' });
        const submitButton = component.find('[data-test="submit"]');

        await submitButton.trigger('click');
        expect(store.registerUser).toHaveBeenCalledWith(mockedRegisterInfo);
      });

      it('should navigate to the home page upon successful registration', async () => {
        const { component, store } = await render();
        component.find('[id="name"]').setValue('Test User');
        component.find('[id="email-address"]').setValue('test@test.com');
        component.find('[id="password"]').setValue('password123');
        store.$patch({ id: 'user123' });
        const submitButton = component.find('[data-test="submit"]');
        await submitButton.trigger('click');
        expect(navigateToMock).toHaveBeenCalledWith('/home');
      });
    });

    describe('when registration fails', () => {
      it('should call the register function with the register information', async () => {
        const { component, store } = await render();
        component.find('[id="name"]').setValue('Test User');
        component.find('[id="email-address"]').setValue('test@test.com');
        component.find('[id="password"]').setValue('password123');
        const submitButton = component.find('[data-test="submit"]');
        await submitButton.trigger('click');
        expect(store.registerUser).toHaveBeenCalledWith(mockedRegisterInfo);
      });

      it('should not navigate', async () => {
        const { component } = await render();
        component.find('[id="name"]').setValue('Test User');
        component.find('[id="email-address"]').setValue('test@test.com');
        component.find('[id="password"]').setValue('password123');
        const submitButton = component.find('[data-test="submit"]');
        await submitButton.trigger('click');
        expect(navigateToMock).not.toHaveBeenCalledWith('/home');
      });
    });
  });
});
