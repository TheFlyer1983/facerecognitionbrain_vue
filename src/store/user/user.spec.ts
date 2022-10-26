import { SpyInstance } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from './user';
import request from '@/functions/request';
import {
  getAuthTokenInSession,
  removeAuthTokenFromSession,
  saveAuthTokenInSession
} from '@/functions/storageFunctions';
import { endpoints } from '@/constants';
import { LoginInfo } from '@/types';
import { UserMock } from '@/fixtures/users';

vi.mock('@/functions/request');
vi.mock('@/functions/storageFunctions');

const mockedGetToken = vi.mocked(getAuthTokenInSession);
const mockedRemoveToken = vi.mocked(removeAuthTokenFromSession);
const mockedSaveToken = vi.mocked(saveAuthTokenInSession);

const pinia = createPinia();
const mockUserStore = useUserStore(pinia);

describe('Given the user store', () => {
  beforeAll(() => {
    setActivePinia(pinia);
  });

  describe('and when the actions are called', () => {
    let requestSpy: SpyInstance;
    let errorSpy: SpyInstance;
    let functionSpy: SpyInstance;

    describe('and when `getUser` is called', () => {
      const payloadMock = '1';
      const requestURL = endpoints.getProfile.replace(':id', payloadMock);
      const responseMock = {
        id: 1,
        name: 'User 1',
        email: 'test@test.com',
        entries: '6',
        joined: '2021-04-09T00:00:00.000Z'
      };

      beforeEach(async () => {
        requestSpy = vi
          .spyOn(request, 'get')
          .mockResolvedValue({ data: responseMock });

        functionSpy = vi.spyOn(mockUserStore, 'getRank');

        await mockUserStore.getUser(payloadMock);
      });

      it('should call the `getUser` api', () => {
        expect(requestSpy).toHaveBeenCalledWith(requestURL);
      });

      it('should update the state correctly', () => {
        expect(mockUserStore.user).toStrictEqual(responseMock);
        expect(mockUserStore.isSignedIn).toBe(true);
      });

      it('should call the next action', () => {
        expect(functionSpy).toHaveBeenCalled();
      });

      describe('and when the api call is unsuccessful', () => {
        const error = new Error('error');

        beforeEach(async () => {
          mockUserStore.$reset();
          vi.spyOn(request, 'get').mockRejectedValue(error.message);

          errorSpy = vi.spyOn(console, 'error').mockImplementation(() => ({}));

          await mockUserStore.getUser(payloadMock);
        });

        it('should throw error', () => {
          expect(errorSpy).toHaveBeenCalledWith(error.message);
        });

        it('should not update the state', () => {
          expect(mockUserStore.user).toBeNull();
          expect(mockUserStore.isSignedIn).toBe(false);
        });
      });
    });

    describe('and when `login` is called', () => {
      const requestURL = endpoints.signin;

      const payload: LoginInfo = {
        email: 'test@test.com',
        password: 'password'
      };

      const mockedResponse = {
        success: 'true',
        userId: 1,
        token: 'ABC123ABC123'
      };

      beforeEach(async () => {
        requestSpy = vi
          .spyOn(request, 'post')
          .mockResolvedValue({ data: mockedResponse });

        errorSpy = vi.spyOn(console, 'error');

        functionSpy = vi
          .spyOn(mockUserStore, 'getUser')
          .mockResolvedValue(true);

        await mockUserStore.login(payload);
      });

      it('should call the login api', () => {
        expect(requestSpy).toHaveBeenCalledWith(requestURL, payload);
      });

      it('shoud update the state corectly', () => {
        expect(mockUserStore.token).toStrictEqual(mockedResponse.token);
        expect(mockUserStore.user?.id).toStrictEqual(mockedResponse.userId);
      });

      it('should save the token in local storage', () => {
        expect(mockedSaveToken).toHaveBeenCalledWith(mockedResponse.token);
      });

      it('should call the next action', () => {
        expect(mockUserStore.getUser).toHaveBeenCalledWith(
          mockedResponse.userId
        );
      });

      it('and the action should return `true`', () => {
        expect(functionSpy.mock.results[0].value).toBe(true);
      });

      it('should not throw an error', () => {
        expect(errorSpy).not.toHaveBeenCalled();
      });

      describe('and when the api call fails', () => {
        const error = new Error('error');

        beforeEach(async () => {
          mockUserStore.$reset();
          vi.spyOn(request, 'post').mockRejectedValue(error.message);

          errorSpy = vi.spyOn(console, 'error').mockImplementation(() => ({}));

          await mockUserStore.login(payload);
        });

        it('should throw an error', () => {
          expect(errorSpy).toHaveBeenCalledWith(error.message);
        });

        it('should not update the state', () => {
          expect(mockUserStore.token).toBe('');
          expect(mockUserStore.user).toBeNull();
        });
      });

      describe('when the action returns false', () => {
        const error = new Error('Error');

        beforeEach(async () => {
          vi.spyOn(request, 'post').mockResolvedValue({ data: mockedResponse });

          functionSpy = vi
            .spyOn(mockUserStore, 'getUser')
            .mockResolvedValue(false);

          errorSpy = vi.spyOn(console, 'error').mockImplementation(() => ({}));

          await mockUserStore.login(payload);
        });

        it('the action should return false', () => {
          expect(functionSpy.mock.results[0].value).toBe(false);
        });

        it('should throw an error', () => {
          expect(errorSpy).toHaveBeenCalledWith(error);
        });
      });
    });

    describe('and when `registerUser` is called', () => {
      const payloadMock = {
        name: 'User 1',
        email: 'test@test.com',
        password: 'password'
      };
      const requestURL = endpoints.register;
      const responseMock = {
        register: {
          response: 'Success',
          user: {
            id: 2,
            name: 'Paul',
            email: 'theflyer1983123@gmail.com',
            entries: '0',
            joined: '2022-03-15T15:43:43.780Z'
          }
        },
        session: {
          success: 'true',
          userId: 2,
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRoZWZseWVyMTk4MzEyM0BnbWFpbC5jb20iLCJpYXQiOjE2NDczNTkwMjMsImV4cCI6MTY0NzUzMTgyM30.KLUZdREDkcFdtgkkRN1yrP9d2rvV24X_SOph4n9CYi0'
        }
      };

      beforeEach(async () => {
        requestSpy = vi
          .spyOn(request, 'post')
          .mockResolvedValue({ data: responseMock });

        await mockUserStore.registerUser(payloadMock);
      });

      it('should call the `registerUser` api', () => {
        expect(requestSpy).toHaveBeenCalledWith(requestURL, payloadMock);
      });

      it('should update the state correctly', () => {
        expect(mockUserStore.user).toStrictEqual(responseMock.register.user);
      });

      it('should save the token in local storage', () => {
        expect(mockedSaveToken).toHaveBeenCalledWith(
          responseMock.session.token
        );
      });

      describe('and when the api call fails', () => {
        const error = new Error('error');

        beforeEach(async () => {
          mockUserStore.$reset();
          vi.spyOn(request, 'post').mockRejectedValue(error.message);

          errorSpy = vi.spyOn(console, 'error').mockImplementation(() => ({}));

          await mockUserStore.registerUser(payloadMock);
        });

        it('should throw error', () => {
          expect(errorSpy).toHaveBeenCalledWith(error.message);
        });

        it('should not update the state', () => {
          expect(mockUserStore.user).toBeNull();
        });
      });
    });

    describe('and when `getToken` is called', () => {
      const mockedToken = 'ABC123ABC123';

      beforeEach(() => {
        functionSpy = vi.spyOn(mockUserStore, 'authenticated');

        mockedGetToken.mockReturnValue(mockedToken);

        mockUserStore.getToken();
      });

      it('should retreive the token', () => {
        expect(mockedGetToken).toHaveBeenCalled();
      });

      it('should update the state correctly', () => {
        expect(mockUserStore.token).toStrictEqual(mockedToken);
      });

      it('should call the next action', () => {
        expect(functionSpy).toHaveBeenCalled();
      });

      describe('and when there is no token available', () => {
        beforeEach(() => {
          mockUserStore.$reset();

          mockedGetToken.mockReturnValue(null);

          mockUserStore.getToken();
        });

        it('should not update the state', () => {
          expect(mockUserStore.token).toBe('');
        });
      });
    });

    describe('and when `authenticated` is called', () => {
      const mockedResponse = {
        id: 1
      };

      beforeEach(async () => {
        mockUserStore.$patch({ token: 'ABC123ABC123' });

        requestSpy = vi
          .spyOn(request, 'post')
          .mockResolvedValue({ data: mockedResponse });

        functionSpy = vi.spyOn(mockUserStore, 'getUser');

        await mockUserStore.authenticated();
      });

      it('should call the api', () => {
        expect(requestSpy).toHaveBeenCalledWith(endpoints.signin);
      });

      it('call the next action', () => {
        expect(functionSpy).toHaveBeenCalledWith(mockedResponse.id);
      });

      describe('and when the api call fails', () => {
        const error = new Error('error');

        beforeEach(async () => {
          vi.spyOn(request, 'post').mockRejectedValue(error.message);

          errorSpy = vi.spyOn(console, 'error').mockImplementation(() => ({}));

          await mockUserStore.authenticated();
        });

        it('should throw error', () => {
          expect(errorSpy).toHaveBeenCalledWith(error.message);
        });
      });

      describe('and when there is no token', () => {
        beforeEach(async () => {
          mockUserStore.$reset();

          requestSpy = vi.spyOn(request, 'post');

          functionSpy = vi.spyOn(mockUserStore, 'getUser');

          await mockUserStore.authenticated();
        });

        it('should not call the api', () => {
          expect(requestSpy).not.toHaveBeenCalled();
        });

        it('should not call the next action', () => {
          expect(functionSpy).not.toHaveBeenCalled();
        });
      });
    });

    describe('and when `getRank` is called', () => {
      const mockedResponse = '🔸';

      beforeEach(async () => {
        mockUserStore.$patch({ user: { ...UserMock } });

        requestSpy = vi
          .spyOn(request, 'post')
          .mockResolvedValue({ data: mockedResponse });

        await mockUserStore.getRank();
      });

      it('should call the api', () => {
        expect(requestSpy).toHaveBeenCalledWith(endpoints.rank, {
          entries: mockUserStore.user?.entries
        });
      });

      it('should update the state correctly', () => {
        expect(mockUserStore.rank).toStrictEqual(mockedResponse);
      });

      describe('and when the api call fails', () => {
        const error = new Error('error');

        beforeEach(async () => {
          mockUserStore.$reset();

          vi.spyOn(request, 'post').mockRejectedValue(error.message);

          errorSpy = vi.spyOn(console, 'error').mockImplementation(() => ({}));

          await mockUserStore.getRank();
        });

        it('should throw an error', () => {
          expect(errorSpy).toHaveBeenCalledWith(error.message);
        });

        it('should not update the state', () => {
          expect(mockUserStore.rank).toStrictEqual('');
        });
      });
    });

    describe('and when signout is called', () => {
      beforeEach(() => {
        functionSpy = vi.spyOn(mockUserStore, '$reset');
        mockUserStore.signout();
      });

      it('should call `removeAuthTokenFromSession`', () => {
        expect(mockedRemoveToken).toHaveBeenCalled();
      });

      it('should reset the state', () => {
        expect(functionSpy).toHaveBeenCalled();
      });
    });

    describe('and when `updateUser` is called', () => {
      const mockedResponse = 'success';

      const mockedPayload = {
        name: 'Paul',
        age: 39,
        pet: 'Ruby'
      };

      const requestURL = `${endpoints.profile}/${UserMock.id}`;

      beforeEach(async () => {
        mockUserStore.$patch({ user: { ...UserMock } });

        requestSpy = vi
          .spyOn(request, 'post')
          .mockResolvedValue({ data: mockedResponse });

        functionSpy = vi.spyOn(mockUserStore, 'getUser');

        await mockUserStore.updateUser(mockedPayload);
      });

      it('should call the api', () => {
        expect(requestSpy).toHaveBeenCalledWith(requestURL, {
          formInput: mockedPayload
        });
      });

      it('should call the next action', () => {
        expect(functionSpy).toHaveBeenCalledWith(UserMock.id);
      });

      describe('and when the api call fails', () => {
        const error = new Error('error');

        beforeEach(async () => {
          vi.spyOn(request, 'post').mockRejectedValue(error.message);

          errorSpy = vi.spyOn(console, 'error').mockImplementation(() => ({}));

          await mockUserStore.updateUser(mockedPayload);
        });

        it('should throw an error', () => {
          expect(errorSpy).toHaveBeenCalledWith(error.message);
        });
      });
    });

    describe('and when `deleteUser` is called', () => {
      const mockedResponse = {
        response: 'Success',
        message: 'User deleted successfully'
      };

      const requestURL = `${endpoints.user}/${UserMock.id}`;

      beforeEach(async () => {
        mockUserStore.$patch({ user: { ...UserMock } });

        requestSpy = vi
          .spyOn(request, 'delete')
          .mockResolvedValue({ data: mockedResponse });

        functionSpy = vi.spyOn(mockUserStore, 'signout');

        await mockUserStore.deleteUser();
      });

      it('should call the api', () => {
        expect(requestSpy).toHaveBeenCalledWith(requestURL);
      });

      it('should call the next action', () => {
        expect(functionSpy).toHaveBeenCalled();
      });

      describe('when the api call fails', () => {
        const error = new Error('error');

        beforeEach(async () => {
          vi.spyOn(request, 'delete').mockRejectedValue(error.message);

          errorSpy = vi.spyOn(console, 'error').mockImplementation(() => ({}));

          await mockUserStore.deleteUser();
        });

        it('should throw an error', () => {
          expect(errorSpy).toHaveBeenCalledWith(error.message);
        });
      });
    });
  });
});
