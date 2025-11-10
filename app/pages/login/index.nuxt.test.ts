import {
  it,
  expect,
  describe,
  vi,
  beforeAll,
  afterAll
} from 'vitest';
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime';
import LoginPage from './index.vue';
import { createTestingPinia } from '@pinia/testing';

const { navigateToMock } = vi.hoisted(() => ({
  navigateToMock: vi.fn()
}));

mockNuxtImport('navigateTo', () => navigateToMock);

const pinia = createTestingPinia({
  createSpy: vi.fn,
  stubActions: ['login']
});
const mockUserStore = useUserStore(pinia);

const mockedLoginInfo = {
  email: 'test@test.com',
  password: 'password123'
};

describe('Login Page', async () => {
  const component = await mountSuspended(LoginPage, {
    global: {
      plugins: [pinia]
    },
    route: '/login'
  });

  describe('when the component is rendered', () => {
    it('can mount the component', () => {
      expect(component.exists()).toBe(true);
      expect(component.html()).toContain('Sign In');
    });
    it('should match the snapshot', () => {
      expect(component.element).toMatchSnapshot();
    });
  });

  describe('When the register link is clicked', () => {
    const registerLink = component.find('[data-test="register"]');
    it('should exist', () => {
      expect(registerLink.exists()).toBe(true);
    });

    it('should navigate to the register page', async () => {
      await registerLink.trigger('click');
      expect(navigateToMock).toHaveBeenCalledWith('/register');
    });
  });

  describe('When the submit button is clicked', () => {
    const submitButton = component.find('[data-test="submit"]');
    it('should exist', () => {
      expect(submitButton.exists()).toBe(true);
    });

    describe('with valid login information', () => {
      beforeAll(() => {
        component.find('[id="email-address"]').setValue('test@test.com');
        component.find('[id="password"]').setValue('password123');

        mockUserStore.$patch({ id: 'user123' });
      });

      afterAll(() => {
        vi.clearAllMocks();
        mockUserStore.reset();
      });

      it('should call the login function with the login information', async () => {
        await submitButton.trigger('click');
        expect(mockUserStore.login).toHaveBeenCalledWith(mockedLoginInfo);
      });

      it('should navigate to the home page upon successful login', async () => {
        expect(navigateToMock).toHaveBeenCalledWith('/home');
      });
    });

    describe('with invalid login information', () => {
      beforeAll(async () => {
        component.find('[id="email-address"]').setValue('test@test.com');
        component.find('[id="password"]').setValue('password123');
      });

      afterAll(() => {
        vi.clearAllMocks();
        mockUserStore.reset();
      });

      it('should call the login function with the login information', async () => {
        await submitButton.trigger('click');
        expect(mockUserStore.login).toHaveBeenCalledWith(mockedLoginInfo);
      });

      it('should not navigate', async () => {
        expect(navigateToMock).not.toHaveBeenCalledWith('/home');
      });
    });
  });
});
