import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime';
import LoginPage from './index.vue';
import { createTestingPinia } from '@pinia/testing';
import { useUserStore } from '~/stores/user';

const { navigateToMock } = vi.hoisted(() => ({
  navigateToMock: vi.fn()
}));

mockNuxtImport('navigateTo', () => navigateToMock);

const mockedLoginInfo = {
  email: 'test@test.com',
  password: 'password123'
};

describe('Login Page', () => {
  const render = async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: ['login']
    });
    const component = await mountSuspended(LoginPage, {
      global: {
        plugins: [pinia]
      },
      route: '/login'
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
      expect(component.html()).toContain('Sign In');
    });
    it('should match the snapshot', async () => {
      const { component } = await render();
      expect(component.element).toMatchSnapshot();
    });
  });

  describe('When the register link is clicked', () => {
    it('should exist', async () => {
      const { component } = await render();
      const registerLink = component.find('[data-test="register"]');
      expect(registerLink.exists()).toBe(true);
    });

    it('should navigate to the register page', async () => {
      const { component } = await render();
      const registerLink = component.find('[data-test="register"]');
      await registerLink.trigger('click');
      expect(navigateToMock).toHaveBeenCalledWith('/register');
    });
  });

  describe('When the submit button is clicked', () => {
    it('should exist', async () => {
      const { component } = await render();
      const submitButton = component.find('[data-test="submit"]');
      expect(submitButton.exists()).toBe(true);
    });

    describe('with valid login information', () => {
      it('should call the login function with the login information', async () => {
        const { component, store } = await render();
        component.find('[id="email-address"]').setValue('test@test.com');
        component.find('[id="password"]').setValue('password123');
        store.$patch({ id: 'user123' });
        const submitButton = component.find('[data-test="submit"]');

        await submitButton.trigger('click');
        expect(store.login).toHaveBeenCalledWith(mockedLoginInfo);
      });

      it('should navigate to the home page upon successful login', async () => {
        const { component, store } = await render();
        component.find('[id="email-address"]').setValue('test@test.com');
        component.find('[id="password"]').setValue('password123');
        store.$patch({ id: 'user123' });
        const submitButton = component.find('[data-test="submit"]');
        await submitButton.trigger('click');
        expect(navigateToMock).toHaveBeenCalledWith('/home');
      });
    });

    describe('with invalid login information', () => {
      it('should call the login function with the login information', async () => {
        const { component, store } = await render();
        component.find('[id="email-address"]').setValue('test@test.com');
        component.find('[id="password"]').setValue('password123');
        const submitButton = component.find('[data-test="submit"]');
        await submitButton.trigger('click');
        expect(store.login).toHaveBeenCalledWith(mockedLoginInfo);
      });

      it('should not navigate', async () => {
        const { component } = await render();
        component.find('[id="email-address"]').setValue('test@test.com');
        component.find('[id="password"]').setValue('password123');
        const submitButton = component.find('[data-test="submit"]');
        await submitButton.trigger('click');
        expect(navigateToMock).not.toHaveBeenCalledWith('/home');
      });
    });
  });
});
