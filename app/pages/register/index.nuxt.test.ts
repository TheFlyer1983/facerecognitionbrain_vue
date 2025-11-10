import { it, expect, describe, vi, beforeAll, afterAll } from 'vitest';
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime';
import { createTestingPinia } from '@pinia/testing';
import { useUserStore } from '~/stores/user';
import RegisterPage from './index.vue';

const { navigateToMock } = vi.hoisted(() => ({
  navigateToMock: vi.fn()
}));

mockNuxtImport('navigateTo', () => navigateToMock);

const pinia = createTestingPinia({
  createSpy: vi.fn,
  stubActions: ['registerUser']
});
const mockUserStore = useUserStore(pinia);

const mockedRegisterInfo = {
  name: 'Test User',
  password: 'password123',
  email: 'test@test.com'
};

describe('Register Page', async () => {
  const component = await mountSuspended(RegisterPage, {
    global: {
      plugins: [pinia]
    },
    route: '/register'
  });

  describe('when the component is rendered', () => {
    it('can mount the component', () => {
      expect(component.exists()).toBe(true);
      expect(component.html()).toContain('Register');
    });

    it('should match the snapshot', () => {
      expect(component.element).toMatchSnapshot();
    });
  });

  describe.skip('When the sign in link is clicked', () => {
    const signInLink = component.find('[data-test="login"]');
    it('should exist', () => {
      expect(signInLink.exists()).toBe(true);
    });

    it('should navigate to the register page', async () => {
      await signInLink.trigger('click');
      expect(navigateToMock).toHaveBeenCalledWith('/login');
    });
  });

  describe('When the submit button is clicked', () => {
    const submitButton = component.find('[data-test="submit"]');
    it('should exist', () => {
      expect(submitButton.exists()).toBe(true);
    });

    describe('with valid register information', () => {
      beforeAll(() => {
        component.find('[id="name"]').setValue('Test User');
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
        expect(mockUserStore.registerUser).toHaveBeenCalledWith(
          mockedRegisterInfo
        );
      });

      it('should navigate to the home page upon successful login', async () => {
        expect(navigateToMock).toHaveBeenCalledWith('/home');
      });
    });

    describe('with invalid register information', () => {
      beforeAll(async () => {
        component.find('[id="name"]').setValue('Test User');
        component.find('[id="email-address"]').setValue('test@test.com');
        component.find('[id="password"]').setValue('password123');
      });

      afterAll(() => {
        vi.clearAllMocks();
        mockUserStore.reset();
      });

      it('should call the login function with the login information', async () => {
        await submitButton.trigger('click');
        expect(mockUserStore.registerUser).toHaveBeenCalledWith(
          mockedRegisterInfo
        );
      });

      it('should not navigate', async () => {
        expect(navigateToMock).not.toHaveBeenCalledWith('/home');
      });
    });
  });
});
